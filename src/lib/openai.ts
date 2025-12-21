import OpenAI from 'openai';
import { TripInput, DayItinerary } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateItinerary(tripInput: TripInput): Promise<{
  itinerary: DayItinerary[];
  total_estimated_cost: number;
}> {
  const { destination, travel_days, budget, travel_style, interests } = tripInput;

  const prompt = `You are an expert travel planner. Create a detailed ${travel_days}-day itinerary for ${destination}.

Trip Details:
- Duration: ${travel_days} days
- Budget: $${budget} USD (total)
- Travel Style: ${travel_style}
- Interests: ${interests.join(', ')}

Requirements:
1. Create a day-by-day itinerary with specific activities
2. Include time slots, locations, and descriptions for each activity
3. Estimate costs for each activity (accommodation, food, activities, transport)
4. Provide daily estimated costs
5. Include practical travel tips for each day
6. Make sure the total estimated cost is close to but not exceeding the budget
7. Match activities to the interests and travel style

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
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional travel planner that creates detailed, realistic itineraries. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const result = JSON.parse(content);
    return {
      itinerary: result.itinerary,
      total_estimated_cost: result.total_estimated_cost,
    };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
}
