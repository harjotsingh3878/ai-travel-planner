import OpenAI from 'openai';
import { AI_CONFIG } from './config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

/**
 * Generate embedding for RAG query or content indexing.
 * Uses OpenAI for consistency with pgvector dimension (1536).
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: AI_CONFIG.openai.embeddingModel,
    input: text.slice(0, 8000),
  });
  const vector = response.data[0]?.embedding;
  if (!vector) throw new Error('No embedding returned');
  return vector;
}
