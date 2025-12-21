# AI Provider Setup Guide

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
- **Model**: `gemini-1.5-flash`
- **Cost**: Free tier available
- **Best for**: Development, testing, production

### OpenAI
- **Model**: `gpt-4o-mini` (can change to `gpt-4o` in `src/lib/ai.ts`)
- **Cost**: ~$0.15 per 1M input tokens
- **Best for**: Production with budget

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
