-- AI usage tracking and RAG (pgvector) for production-grade AI layer

-- Token usage per user (for quotas and cost visibility)
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  request_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at DESC);

-- Enable pgvector for RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings table: cities, attractions, visa rules, past itinerary summaries
CREATE TABLE IF NOT EXISTS travel_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('city', 'attraction', 'visa_rule', 'itinerary_summary')),
  source_id UUID,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding vector(1536) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_travel_embeddings_type ON travel_embeddings(content_type);
CREATE INDEX IF NOT EXISTS idx_travel_embeddings_embedding ON travel_embeddings
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

COMMENT ON TABLE travel_embeddings IS 'RAG: vector store for cities, attractions, visa rules, itinerary summaries. Embed with OpenAI text-embedding-3-small (1536 dims).';
COMMENT ON TABLE ai_usage IS 'Per-user token usage for rate limiting and cost tracking.';

-- RPC for similarity search (avoids exposing raw SQL)
CREATE OR REPLACE FUNCTION match_travel_embeddings(
  query_embedding vector(1536),
  match_count int DEFAULT 12,
  filter_content_types text[] DEFAULT NULL
)
RETURNS TABLE (id uuid, content_type varchar(50), content text, metadata jsonb)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.content_type, e.content, e.metadata
  FROM travel_embeddings e
  WHERE (filter_content_types IS NULL OR e.content_type = ANY(filter_content_types))
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
