# AI Provider Setup Guide

## Running the App

### Prerequisites
- **Node.js 18+**
- **Supabase project** and env keys (see [Database migrations](#database-migrations))
- **At least one AI provider** configured (Gemini or OpenAI)

### Install and run

```bash
# Install dependencies
npm install

# Development (with hot reload)
npm run dev
```

Then open **http://localhost:3000**.

### Other commands

```bash
# Production build
npm run build

# Start production server (run after npm run build)
npm start

# Lint
npm run lint
```

---

## Database Migrations

The app needs the base schema plus the AI tables (pgvector, usage tracking). Apply them in order.

### Option A: Supabase Dashboard (no CLI)

1. Go to [Supabase](https://supabase.com) → your project → **SQL Editor**.
2. **Base schema** (users, trips, RLS):  
   Open `supabase/schema.sql`, copy its contents, paste in the SQL Editor, and run.
3. **AI tables** (pgvector, `ai_usage`, `travel_embeddings`, RPC):  
   Open `supabase/migrations/20250204000000_add_ai_tables.sql`, copy its contents, paste in the SQL Editor, and run.

If you already ran `schema.sql` before, run only the migration file.

### Option B: Supabase CLI

If you use the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
# Link to your project (one-time)
supabase link --project-ref your-project-ref

# Run all migrations (applies schema.sql if it’s your first migration, plus 20250204000000_add_ai_tables.sql)
supabase db push
```

Or run migrations from the project root:

```bash
supabase migration up
```

**Note:** The AI migration enables the `vector` extension and creates `travel_embeddings` (for RAG) and `ai_usage` (for token tracking). RAG is optional; if you don’t seed embeddings, the app still works and simply won’t inject context.

---

## Quick Start with Google Gemini (Free & Recommended)

### Step 1: Get Gemini API Key
1. Visit [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key" in Google AI Studio
3. Copy your API key

### Step 2: Update .env.local
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Restart your dev server
```bash
npm run dev
```

That's it! Gemini offers:
- ✅ **Free tier** with generous limits (15 RPM, 1M tokens/min)
- ✅ **Fast responses**
- ✅ **High quality** (comparable to GPT-4)
- ✅ **JSON mode** support

---

## Alternative: OpenAI Setup

### Step 1: Get OpenAI API Key
1. Visit [platform.openai.com](https://platform.openai.com)
2. Add billing details (requires payment)
3. Create API key

### Step 2: Update .env.local
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your_openai_api_key
```

### Step 3: Restart your dev server

---

## Switching Between Providers

Simply change the `AI_PROVIDER` in `.env.local`:

```env
AI_PROVIDER=gemini   # Use Google Gemini (free)
# OR
AI_PROVIDER=openai   # Use OpenAI (paid)
```

Restart the dev server after changing.

---

## Models Used

### Gemini
- **Model**: `gemini-2.5-flash` (override with `GEMINI_MODEL` in `.env.local`)
- **Cost**: Free tier available
- **Best for**: Development, testing, production

### OpenAI
- **Model**: `gpt-4o-mini` (override with `OPENAI_MODEL` in `.env.local`)
- **Cost**: ~$0.15 per 1M input tokens
- **Best for**: Production with budget
- **RAG/embeddings**: Uses `text-embedding-3-small` when RAG is enabled; requires `OPENAI_API_KEY` even if `AI_PROVIDER=gemini` (or RAG is skipped)

---

## Troubleshooting

### Error: "GEMINI_API_KEY is not configured"
- Make sure `GEMINI_API_KEY` is set in `.env.local`
- Restart your dev server

### Error: "429 Quota exceeded" (OpenAI)
- Add billing to your OpenAI account
- Switch to Gemini (free alternative)

### Error: "Invalid JSON response"
- This is rare with the current setup
- Check the AI provider's status page
- Try regenerating the trip
