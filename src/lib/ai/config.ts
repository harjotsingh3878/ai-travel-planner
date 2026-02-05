/**
 * AI layer configuration: providers, models, limits.
 */

export type AIProvider = 'openai' | 'gemini';

export const AI_CONFIG = {
  provider: (process.env.AI_PROVIDER as AIProvider) || ('gemini' as AIProvider),
  fallbackProvider: (process.env.AI_FALLBACK_PROVIDER as AIProvider) || ('openai' as AIProvider),

  openai: {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    embeddingDimensions: 1536,
    maxTokens: 4000,
    temperature: 0.4,
  },

  gemini: {
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    embeddingModel: 'text-embedding-004', // or model that returns 768-dim
    embeddingDimensions: 768,
    maxTokens: 4000,
    temperature: 0.4,
  },

  rag: {
    topK: parseInt(process.env.RAG_TOP_K || '12', 10),
    maxChunkLength: parseInt(process.env.RAG_MAX_CHUNK_LENGTH || '500', 10),
  },

  validation: {
    maxRetries: 2,
    maxFallbackAttempts: 1,
  },

  tools: {
    maxIterations: 3,
  },
} as const;
