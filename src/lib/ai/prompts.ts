import { TripInput } from '@/types';
import { ITINERARY_JSON_SPEC } from './schema';

const RAG_BLOCK_LABEL = '--- Verified context (use only this information; do not invent details not stated here) ---';

/**
 * System prompt: role, constraints, anti-hallucination, output format.
 */
export const SYSTEM_PROMPT = `You are an expert travel planner. You only use verified information from the context below or from tool results. Do not invent addresses, opening hours, or exact prices unless they were provided in the context or by a tool.

Output rules:
- Respond with exactly one JSON object matching the provided schema.
- No markdown, no code fences, no extra text before or after the JSON.
- Budget is in USD; the total estimated cost must not exceed the user's budget.
- Respect the number of days and travel style (budget = low-cost, moderate = mid-range, luxury = high-end).
- If context does not contain enough detail for a specific activity, describe it in general terms and do not fabricate names, times, or prices.`;

/**
 * Build user message: optional RAG context + trip details + JSON spec.
 */
export function buildUserMessage(tripInput: TripInput, ragContext?: string): string {
  const { destination, travel_days, budget, travel_style, interests } = tripInput;

  const tripBlock = `
Trip details:
- Destination: ${destination}
- Duration: ${travel_days} days
- Budget: $${budget} USD total (do not suggest a total cost above this)
- Travel style: ${travel_style}
- Interests: ${interests.join(', ')}

Requirements:
1. Create a day-by-day itinerary with specific activities.
2. Include time slots, locations, and descriptions for each activity.
3. Estimate costs for each activity (accommodation, food, activities, transport).
4. Provide daily estimated costs.
5. Include practical travel tips for each day.
6. Total estimated cost must be at or below $${budget} USD.
7. Match activities to the interests and travel style.
`.trim();

  const parts: string[] = [];
  if (ragContext && ragContext.trim()) {
    parts.push(RAG_BLOCK_LABEL);
    parts.push(ragContext.trim());
    parts.push('--- End of verified context ---');
  }
  parts.push(tripBlock);
  parts.push(ITINERARY_JSON_SPEC);

  return parts.join('\n\n');
}

/**
 * Build retry user message when validation fails (append to conversation).
 */
export function buildRetryMessage(validationError: string): string {
  return `Your previous response had validation errors. Please return valid JSON only.\nErrors: ${validationError}`;
}
