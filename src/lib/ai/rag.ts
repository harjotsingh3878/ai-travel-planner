import { supabaseAdmin } from '@/lib/supabase';
import { getEmbedding } from './embeddings';
import { AI_CONFIG } from './config';
import { TripInput } from '@/types';

export type EmbeddingContentType = 'city' | 'attraction' | 'visa_rule' | 'itinerary_summary';

export interface TravelChunk {
  id: string;
  content_type: EmbeddingContentType;
  content: string;
  metadata: Record<string, unknown>;
}

const MAX_CHUNK_LENGTH = AI_CONFIG.rag.maxChunkLength;

/**
 * Build query text for embedding (destination + style + interests).
 */
function buildQueryText(input: TripInput): string {
  const parts = [input.destination, input.travel_style, ...input.interests];
  return parts.join(' ').trim();
}

/**
 * Retrieve relevant travel chunks from pgvector for RAG context.
 * Returns empty string if embeddings table is empty or RPC fails (graceful degradation).
 */
export async function retrieveRAGContext(tripInput: TripInput): Promise<string> {
  try {
    const queryText = buildQueryText(tripInput);
    const embedding = await getEmbedding(queryText);
    const { data, error } = await supabaseAdmin.rpc('match_travel_embeddings', {
      query_embedding: embedding,
      match_count: AI_CONFIG.rag.topK,
      filter_content_types: null,
    });

    if (error) {
      console.warn('[RAG] match_travel_embeddings error:', error.message);
      return '';
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return '';
    }

    const chunks = data as TravelChunk[];
    const contextParts = chunks.map((c) => {
      const content = c.content.length > MAX_CHUNK_LENGTH
        ? c.content.slice(0, MAX_CHUNK_LENGTH) + '...'
        : c.content;
      return `[${c.content_type}]\n${content}`;
    });

    return contextParts.join('\n\n');
  } catch (e) {
    console.warn('[RAG] retrieval failed:', e);
    return '';
  }
}
