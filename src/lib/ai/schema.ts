import { z } from 'zod';

/**
 * Single source of truth for itinerary JSON shape.
 * Used for Zod validation and for documenting the expected structure in prompts.
 */

export const ActivitySchema = z.object({
  time: z.string().regex(/^\d{1,2}:\d{2}\s*(AM|PM)$/i, 'Time must be like "09:00 AM"'),
  name: z.string().min(1, 'Activity name required').max(200),
  description: z.string().min(1).max(1000),
  location: z.string().min(1).max(300),
  cost: z.number().min(0),
  duration: z.string().min(1).max(100),
});

export const DayItinerarySchema = z.object({
  day: z.number().int().min(1),
  title: z.string().min(1).max(200),
  activities: z.array(ActivitySchema).min(1).max(20),
  estimated_cost: z.number().min(0),
  tips: z.array(z.string().max(500)).max(10),
});

export const ItineraryOutputSchema = z.object({
  itinerary: z.array(DayItinerarySchema),
  total_estimated_cost: z.number().min(0),
});

export type Activity = z.infer<typeof ActivitySchema>;
export type DayItinerary = z.infer<typeof DayItinerarySchema>;
export type ItineraryOutput = z.infer<typeof ItineraryOutputSchema>;

/** JSON schema-like description for prompt injection (reduced hallucination) */
export const ITINERARY_JSON_SPEC = `
Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "09:00 AM",
          "name": "Activity name",
          "description": "Detailed description",
          "location": "Specific location",
          "cost": 50,
          "duration": "2 hours"
        }
      ],
      "estimated_cost": 150,
      "tips": ["Tip 1", "Tip 2"]
    }
  ],
  "total_estimated_cost": 1000
}`.trim();

/**
 * Parse and validate LLM response. Returns result or validation errors.
 */
export function validateItineraryResponse(
  raw: string
): { success: true; data: ItineraryOutput } | { success: false; error: string; issues?: z.ZodIssue[] } {
  let parsed: unknown;
  try {
    const cleaned = raw
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/i, '');
    parsed = JSON.parse(cleaned);
  } catch {
    return { success: false, error: 'Invalid JSON' };
  }

  const result = ItineraryOutputSchema.safeParse(parsed);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    error: result.error.message,
    issues: result.error.issues,
  };
}
