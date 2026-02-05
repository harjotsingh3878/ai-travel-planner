import { TripInput } from '@/types';
import { AI_CONFIG } from './config';
import { SYSTEM_PROMPT, buildUserMessage, buildRetryMessage } from './prompts';
import { retrieveRAGContext } from './rag';
import { validateItineraryResponse, type ItineraryOutput } from './schema';
import { callLLM } from './providers';
import { logTokenUsage, getTokenUsageInWindow } from './tokenTracking';
import { checkRateLimit, checkTokenQuota } from './rateLimit';

export interface GenerateItineraryOptions {
  userId: string;
  tripInput: TripInput;
  enableRAG?: boolean;
  requestId?: string;
}

export interface GenerateItineraryResult {
  success: true;
  itinerary: ItineraryOutput['itinerary'];
  total_estimated_cost: number;
  provider: string;
  requestId: string;
}

export interface GenerateItineraryError {
  success: false;
  error: string;
  code?: 'RATE_LIMIT' | 'QUOTA' | 'VALIDATION' | 'PROVIDER';
}

/**
 * Production orchestrator: rate limit → optional RAG → LLM (primary/fallback) → Zod validate → retry → log usage.
 */
export async function generateItineraryWithOrchestrator(
  options: GenerateItineraryOptions
): Promise<GenerateItineraryResult | GenerateItineraryError> {
  const { userId, tripInput, enableRAG = true, requestId = crypto.randomUUID() } = options;

  const rate = checkRateLimit(userId);
  if (!rate.allowed) {
    return {
      success: false,
      error: 'Rate limit exceeded. Try again later.',
      code: 'RATE_LIMIT',
    };
  }

  const quota = await checkTokenQuota(userId, getTokenUsageInWindow);
  if (!quota.allowed) {
    return {
      success: false,
      error: 'Daily token quota exceeded.',
      code: 'QUOTA',
    };
  }

  let ragContext = '';
  if (enableRAG) {
    try {
      ragContext = await retrieveRAGContext(tripInput);
    } catch {
      // Continue without RAG
    }
  }

  const userMessage = buildUserMessage(tripInput, ragContext || undefined);
  const providers: Array<'openai' | 'gemini'> = [
    AI_CONFIG.provider,
    ...(AI_CONFIG.fallbackProvider !== AI_CONFIG.provider ? [AI_CONFIG.fallbackProvider] : []),
  ];

  let lastError = '';
  let lastContent = '';

  for (const provider of providers) {
    try {
      let content: string;
      let inputTokens = 0;
      let outputTokens = 0;
      let model = '';

      const response = await callLLM(provider, SYSTEM_PROMPT, userMessage);
      content = response.content;
      inputTokens = response.inputTokens;
      outputTokens = response.outputTokens;
      model = response.model;

      const validation = validateItineraryResponse(content);
      if (validation.success) {
        await logTokenUsage({
          userId,
          provider,
          model,
          inputTokens,
          outputTokens,
          requestId,
        });
        return {
          success: true,
          itinerary: validation.data.itinerary,
          total_estimated_cost: validation.data.total_estimated_cost,
          provider,
          requestId,
        };
      }

      lastContent = content;
      lastError = validation.error;

      // Retry once with validation error message (same provider)
      const retryMessage = buildRetryMessage(validation.error);
      const retryResponse = await callLLM(
        provider,
        SYSTEM_PROMPT,
        `${userMessage}\n\n---\n\n${retryMessage}`
      );
      const retryValidation = validateItineraryResponse(retryResponse.content);
      if (retryValidation.success) {
        await logTokenUsage({
          userId,
          provider,
          model: retryResponse.model,
          inputTokens: retryResponse.inputTokens,
          outputTokens: retryResponse.outputTokens,
          requestId,
        });
        return {
          success: true,
          itinerary: retryValidation.data.itinerary,
          total_estimated_cost: retryValidation.data.total_estimated_cost,
          provider,
          requestId,
        };
      }
      lastContent = retryResponse.content;
      lastError = retryValidation.error;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      lastError = message;
      continue;
    }
  }

  console.error('[AI] All providers failed or validation failed. Last error:', lastError, 'Last content length:', lastContent?.length ?? 0);
  return {
    success: false,
    error: 'Failed to generate a valid itinerary. Please try again.',
    code: 'VALIDATION',
  };
}
