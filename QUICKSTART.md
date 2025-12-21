# Quick Start Guide - AI Travel Planner

Get your AI Travel Planner running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Supabase account created
- [ ] OpenAI API key obtained

## Step-by-Step Setup

### 1. Install Dependencies (1 minute)

```bash
cd ai-travel-planner
npm install
```

### 2. Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Navigate to **SQL Editor**
3. Copy contents of `supabase/schema.sql` and execute
4. Go to **Settings → API** and copy:
   - Project URL
   - Anon/Public key
   - Service Role key (keep secret!)

### 3. Configure Environment (1 minute)

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run_openssl_rand_base64_32_to_generate
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=sk-your_openai_key
```

Generate NextAuth secret:
```bash
openssl rand -base64 32
```

### 4. Start the App (1 minute)

```bash
npm run dev
```

Open http://localhost:3000

## Quick Test

1. **Sign Up**: Create account at /auth/signup
2. **Create Trip**: Go to "Create Trip"
   - Destination: "Paris, France"
   - Days: 3
   - Budget: $1500
   - Style: Moderate
   - Interests: Culture & History, Food & Dining
3. **Generate**: Wait 15-30 seconds for AI magic
4. **View**: Explore your personalized itinerary!

## Troubleshooting

**Port 3000 already in use:**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**OpenAI errors:**
- Verify API key starts with `sk-`
- Check OpenAI account has credits

**Supabase connection failed:**
- Double-check URL and keys
- Ensure schema was executed

**Build errors:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Next Steps

- Explore the Dashboard analytics

## 🚀 Deploy to Vercel (5 minutes)

### Quick Deploy

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Add environment variables:**
```bash
# Copy each variable from .env.local
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add AI_PROVIDER production
vercel env add GEMINI_API_KEY production
```

5. **Set production URL:**
```bash
vercel env add NEXTAUTH_URL production
# Enter: https://your-app-name.vercel.app
```

6. **Redeploy:**
```bash
vercel --prod
```

### Your App is Live! 🎉

Visit: `https://your-app-name.vercel.app`

### Automatic Deployments

Push to GitHub for auto-deploy:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-travel-planner.git
git push -u origin main
```

Then connect repository in Vercel dashboard for automatic deployments on every push.
- Create multiple trips to see charts populate
- Try regenerating itineraries
- Check out the comprehensive [README.md](./README.md) for full documentation

Happy travels! 🌍✈️
