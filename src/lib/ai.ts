import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TripInput, DayItinerary } from '@/types';

// AI Provider Configuration
type AIProvider = 'openai' | 'gemini';
const AI_PROVIDER: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function buildPrompt(tripInput: TripInput): string {
  const { destination, travel_days, budget, travel_style, interests } = tripInput;

  return `You are an expert travel planner. Create a detailed ${travel_days}-day itinerary for ${destination}.

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
}

async function generateWithOpenAI(prompt: string): Promise<string> {
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

  return content;
}

async function generateWithGemini(prompt: string): Promise<string> {
  const systemInstruction = 'You are a professional travel planner that creates detailed, realistic itineraries. Always respond with valid JSON only.';
  const fullPrompt = `${systemInstruction}\n\n${prompt}\n\nIMPORTANT: Return ONLY valid JSON, no markdown or explanations.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(fullPrompt);
  
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('No content in Gemini response');
  }

  // Clean up response - remove markdown code blocks if present
  let cleanedText = text.trim();
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  return cleanedText;
}

export async function generateItinerary(tripInput: TripInput): Promise<{
  itinerary: DayItinerary[];
  total_estimated_cost: number;
}> {
  const prompt = buildPrompt(tripInput);

  try {
    let content: string;

    // Route to appropriate AI provider
    switch (AI_PROVIDER) {
      case 'openai':
        if (!process.env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY is not configured');
        }
        content = await generateWithOpenAI(prompt);
        break;

      case 'gemini':
        if (!process.env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY is not configured');
        }
        content = await generateWithGemini(prompt);
        break;

      default:
        throw new Error(`Unsupported AI provider: ${AI_PROVIDER}`);
    }

    // Parse and validate response
    const result = JSON.parse(content);
    
    if (!result.itinerary || !Array.isArray(result.itinerary)) {
      throw new Error('Invalid response format: missing itinerary array');
    }

    return {
      itinerary: result.itinerary,
      total_estimated_cost: result.total_estimated_cost || 0,
    };
  } catch (error: any) {
    console.error(`${AI_PROVIDER.toUpperCase()} API error:`, error);
    throw new Error(`Failed to generate itinerary: ${error.message}`);
  }
}
