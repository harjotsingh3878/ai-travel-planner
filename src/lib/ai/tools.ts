/**
 * Tool definitions and handlers for LLM function calling.
 * Used when the model requests weather, currency, distance, or budget info.
 */

export const TOOL_DEFINITIONS = [
  {
    type: 'function' as const,
    function: {
      name: 'get_weather',
      description: 'Get weather forecast for a city on a given date. Use when suggesting outdoor activities or packing.',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'City name' },
          date: { type: 'string', description: 'ISO date YYYY-MM-DD' },
        },
        required: ['city', 'date'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'currency_convert',
      description: 'Convert amount between currencies (e.g. USD to EUR).',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Amount to convert' },
          from_currency: { type: 'string', description: 'e.g. USD' },
          to_currency: { type: 'string', description: 'e.g. EUR' },
        },
        required: ['amount', 'from_currency', 'to_currency'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'budget_calculator',
      description: 'Allocate a total budget across days or categories (accommodation, food, activities, transport).',
      parameters: {
        type: 'object',
        properties: {
          total_budget: { type: 'number', description: 'Total budget in USD' },
          days: { type: 'number', description: 'Number of days' },
          style: { type: 'string', enum: ['budget', 'moderate', 'luxury'], description: 'Travel style' },
        },
        required: ['total_budget', 'days'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_distance',
      description: 'Get approximate distance and travel time between two places in a city (for ordering activities).',
      parameters: {
        type: 'object',
        properties: {
          from_place: { type: 'string', description: 'Starting location' },
          to_place: { type: 'string', description: 'Destination' },
          city: { type: 'string', description: 'City name' },
        },
        required: ['from_place', 'to_place', 'city'],
      },
    },
  },
];

type ToolName = 'get_weather' | 'currency_convert' | 'budget_calculator' | 'get_distance';

/**
 * Execute a tool by name. In production, wire to real APIs (Open-Meteo, exchangerate-api, etc.).
 * Here we return deterministic mocks so the flow is testable without API keys.
 */
export async function executeTool(
  name: ToolName,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'get_weather': {
      const city = String(args.city ?? '');
      const date = String(args.date ?? '');
      // In production: call Open-Meteo or similar
      return JSON.stringify({
        city,
        date,
        conditions: 'Partly cloudy',
        high_c: 22,
        low_c: 14,
        note: 'Check a weather API for real data.',
      });
    }
    case 'currency_convert': {
      const amount = Number(args.amount ?? 0);
      const from = String(args.from_currency ?? 'USD');
      const to = String(args.to_currency ?? 'EUR');
      // In production: call exchangerate-api or similar
      const mockRates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79 };
      const rate = (mockRates[to] ?? 1) / (mockRates[from] ?? 1);
      return JSON.stringify({
        amount,
        from_currency: from,
        to_currency: to,
        converted_amount: Math.round(amount * rate * 100) / 100,
        note: 'Use a live API for real rates.',
      });
    }
    case 'budget_calculator': {
      const total = Number(args.total_budget ?? 0);
      const days = Number(args.days ?? 1);
      const style = String(args.style ?? 'moderate');
      const perDay = Math.round(total / days);
      const allocation =
        style === 'budget'
          ? { accommodation: 0.35, food: 0.3, activities: 0.2, transport: 0.15 }
          : style === 'luxury'
            ? { accommodation: 0.5, food: 0.25, activities: 0.15, transport: 0.1 }
            : { accommodation: 0.4, food: 0.28, activities: 0.22, transport: 0.1 };
      return JSON.stringify({
        total_budget_usd: total,
        days,
        per_day_usd: perDay,
        allocation,
        note: 'Use these ratios to split the budget across days.',
      });
    }
    case 'get_distance': {
      const from = String(args.from_place ?? '');
      const to = String(args.to_place ?? '');
      const city = String(args.city ?? '');
      // In production: call Google Distance Matrix or similar
      return JSON.stringify({
        from_place: from,
        to_place: to,
        city,
        approximate_km: 3,
        approximate_duration_min: 15,
        note: 'Use a maps API for real distances.',
      });
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
