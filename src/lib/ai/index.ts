/**
 * Production AI layer: public API.
 * Use generateItineraryWithOrchestrator for full flow (RAG, validation, retry, fallback, usage).
 */

export { generateItineraryWithOrchestrator } from './orchestrator';
export type { GenerateItineraryOptions, GenerateItineraryResult, GenerateItineraryError } from './orchestrator';
export { validateItineraryResponse, ItineraryOutputSchema } from './schema';
export type { ItineraryOutput, DayItinerary, Activity } from './schema';
export { SYSTEM_PROMPT, buildUserMessage } from './prompts';
export { retrieveRAGContext } from './rag';
export { TOOL_DEFINITIONS, executeTool } from './tools';
export { logTokenUsage, getTokenUsageInWindow } from './tokenTracking';
export { AI_CONFIG } from './config';
