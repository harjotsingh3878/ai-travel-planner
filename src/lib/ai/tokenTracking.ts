import { supabaseAdmin } from '@/lib/supabase';

export interface TokenUsageRecord {
  userId: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  requestId?: string;
}

/**
 * Log token usage to ai_usage for per-user quotas and cost visibility.
 * Does not throw; failures are logged and ignored.
 */
export async function logTokenUsage(record: TokenUsageRecord): Promise<void> {
  const requestId = record.requestId ?? crypto.randomUUID();
  try {
    await supabaseAdmin.from('ai_usage').insert({
      user_id: record.userId,
      provider: record.provider,
      model: record.model,
      input_tokens: record.inputTokens,
      output_tokens: record.outputTokens,
      request_id: requestId,
    });
  } catch (e) {
    console.warn('[AI] logTokenUsage failed:', e);
  }
}

/**
 * Sum tokens for a user in a time window (for quota checks).
 */
export async function getTokenUsageInWindow(
  userId: string,
  since: Date
): Promise<{ totalTokens: number }> {
  const { data, error } = await supabaseAdmin
    .from('ai_usage')
    .select('input_tokens, output_tokens')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString());

  if (error) {
    console.warn('[AI] getTokenUsageInWindow failed:', error);
    return { totalTokens: 0 };
  }

  const totalTokens = (data ?? []).reduce(
    (sum, row) => sum + (row.input_tokens ?? 0) + (row.output_tokens ?? 0),
    0
  );
  return { totalTokens };
}
