# AI Travel Planner

A full-stack AI-powered travel planning application built with Next.js 15, Google Gemini/OpenAI, Supabase, and TypeScript. Generate personalized itineraries with detailed day-by-day plans, track your travel history, and visualize your spending with beautiful analytics dashboards.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** with App Router and Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Redux Toolkit** for UI state management
- **Recharts** for data visualization
- **NextAuth.js** for authentication
- **React Icons** for UI icons
- **date-fns** for date formatting

### Backend
- **Next.js Server Actions** for API logic
- **AI Providers (Configurable)** - Google Gemini (free) or OpenAI for itinerary generation
- **Supabase (PostgreSQL)** for database
- **NextAuth.js** for session management

## 📁 Project Structure

```
ai-travel-planner/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Protected routes with shared layout
│   │   │   ├── dashboard/        # Analytics dashboard
│   │   │   ├── trips/            # Trip management
│   │   │   │   ├── create/       # Create new trip
│   │   │   │   ├── [id]/         # Trip detail page
│   │   │   │   └── page.tsx      # Trip history
│   │   │   ├── layout.tsx        # Dashboard layout with nav
│   │   │   ├── loading.tsx       # Loading state
│   │   │   └── error.tsx         # Error boundary
│   │   ├── api/
│   │   │   └── auth/             # Auth API routes
│   │   │       ├── [...nextauth]/# NextAuth handler
│   │   │       └── register/     # User registration
│   │   ├── auth/
│   │   │   ├── login/            # Login page
│   │   │   └── signup/           # Signup page
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── providers.tsx         # Session provider
│   │   └── globals.css           # Global styles
│   ├── actions/
│   │   └── tripActions.ts        # Server Actions for CRUD
│   ├── components/
│   │   └── ui/                   # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Loading.tsx
│   ├── lib/
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── ai.ts                 # AI provider integration (Gemini/OpenAI)
│   │   └── supabase.ts           # Supabase client
│   ├── store/
│   │   ├── index.ts              # Redux store
│   │   ├── hooks.ts              # Typed hooks
│   │   ├── Provider.tsx          # Redux provider
│   │   └── slices/
│   │       └── uiSlice.ts        # UI state slice
│   ├── types/
│   │   ├── index.ts              # TypeScript interfaces
│   │   └── next-auth.d.ts        # NextAuth type extensions
│   └── middleware.ts             # Route protection
├── supabase/
│   └── schema.sql                # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎯 Features

### ✅ Core Features
- **AI-Powered Itineraries**: Generate detailed day-by-day plans using Google Gemini (free) or OpenAI GPT-4
- **Smart Cost Estimation**: Get accurate budget breakdowns for each activity
- **Customizable Plans**: Specify destination, days, budget, travel style, and interests
- **Trip Management**: Full CRUD operations (create, read, update, delete, regenerate)
- **User Authentication**: Secure login/signup with NextAuth.js
- **Protected Routes**: Middleware-based route protection

### 📊 Dashboard & Analytics
- **Total Trips**: Count of all planned trips
- **Budget Analysis**: Compare planned budget vs estimated costs
- **Travel Spending**: Calculate total budget and savings
- **Destination Insights**: See your most visited destinations
- **Travel Style Distribution**: Pie chart showing budget/moderate/luxury split
- **Timeline Visualization**: Line chart tracking trips and spending over time
- **Budget vs Cost Comparison**: Bar chart comparing planned vs actual estimates

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Tailwind CSS**: Modern, utility-first styling
- **Smooth Animations**: Fade-in, slide-up, and loading animations
- **Interactive Charts**: Recharts-powered visualizations
- **Loading States**: Skeleton screens and spinners
- **Error Boundaries**: Graceful error handling
- **Search & Filters**: Find trips by destination

### 🔐 Authentication & Security
- **Session-based Auth**: JWT tokens with NextAuth.js
- **Protected API Routes**: Server-side authentication checks
- **Row Level Security**: Supabase RLS policies
- **Password Security**: Bcrypt hashing (in production setup)
- **Secure Environment Variables**: API keys stored safely

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Google Gemini API key (free) OR OpenAI API key
- Git

### 1. Clone & Install

```bash
cd ai-travel-planner
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Get your project URL and keys from **Settings → API**

### 3. Get AI Provider API Key

**Option A: Google Gemini (Recommended - Free)**
1. Go to [ai.google.dev](https://ai.google.dev)
2. Click "Get API Key"
3. Create API key in Google AI Studio

**Option B: OpenAI (Paid)**
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Create a new secret key and add billing

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_generate_with_openssl_rand_base64_32

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Provider Configuration
AI_PROVIDER=gemini
# Options: 'gemini' (free) or 'openai' (paid)

# Google Gemini (if using Gemini)
GEMINI_API_KEY=your_gemini_api_key

# OpenAI (if using OpenAI)
OPENAI_API_KEY=sk-your_api_key
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 5. Run the Application

```bash
npm run dev
```

Visit http://localhost:3000

## 📝 Usage Guide

### 1. Create an Account
- Navigate to the landing page
- Click "Sign Up"
- Enter name, email, and password
- You'll be automatically logged in

### 2. Create Your First Trip
- Go to "Create Trip" from the navigation
- Enter destination (e.g., "Tokyo, Japan")
- Set number of days (1-30)
- Enter budget in USD
- Choose travel style: budget, moderate, or luxury
- Select interests (at least one required)
- Click "Generate Trip Plan"
- Wait 10-30 seconds for AI to generate your itinerary

### 3. View Trip Details
- Click on any trip from "My Trips"
- See complete day-by-day itinerary
- View activities with time slots, costs, and descriptions
- Read travel tips for each day
- Check total estimated cost

### 4. Manage Trips
- **Regenerate**: Get a fresh itinerary for the same destination
- **Delete**: Remove trips you no longer need
- **Search**: Filter trips by destination

### 5. Explore Dashboard
- View total trips and spending
- Compare budget vs estimated costs (bar chart)
- See travel style breakdown (pie chart)
- Track travel timeline (line chart)
- Check top destinations

## 🏗️ Architecture & Best Practices

### Server vs Client Components

**Server Components** (default in App Router):
- Dashboard statistics fetching
- Trip data queries
- Initial page renders
- Minimizes client-side JavaScript

**Client Components** (`'use client'`):
- Forms with state (create trip, login, signup)
- Interactive charts (Recharts)
- Modals and UI state
- Redux integration

### Server Actions

All database operations use Next.js Server Actions:
- `createTrip()`: Generate and save AI itinerary
- `getUserTrips()`: Fetch user's trips
- `getTripById()`: Get single trip details
- `deleteTrip()`: Remove trip
- `regenerateTrip()`: Generate new itinerary
- `getDashboardStats()`: Calculate analytics

Benefits:
- Type-safe API calls
- No separate API routes needed
- Automatic revalidation
- Server-side execution

### OpenAI Integration

Structured prompts ensure consistent JSON responses:

```typescript
{
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & City Exploration",
      "activities": [
        {
          "time": "09:00 AM",
          "name": "Activity name",
          "description": "Details",
          "location": "Address",
          "cost": 50,
          "duration": "2 hours"
        }
      ],
      "estimated_cost": 150,
      "tips": ["Tip 1", "Tip 2"]
    }
  ],
  "total_estimated_cost": 1000
}
```

### State Management

**Redux Toolkit** (client UI state only):
- Modal open/close states
- Loading indicators
- Search filters

**Zustand** alternative available but Redux chosen for this project to demonstrate Redux Toolkit skills.

### Database Schema

**Users Table:**
- id (UUID, primary key)
- name, email, password
- image (optional)
- created_at

**Trips Table:**
- id (UUID, primary key)
- user_id (foreign key → users)
- destination, travel_days, budget
- travel_style (enum: budget/moderate/luxury)
- interests (text array)
- itinerary (JSONB)
- total_estimated_cost
- created_at, updated_at

### Route Protection

Middleware checks authentication for protected routes:

```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/trips/:path*', '/auth/:path*'],
};
```

- Unauthenticated users → redirect to /auth/login
- Authenticated users on /auth → redirect to /dashboard

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables on Vercel

Add all variables from `.env.local`:
- NEXTAUTH_URL (set to your Vercel domain)
- NEXTAUTH_SECRET
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY

### Alternative: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t ai-travel-planner .
docker run -p 3000:3000 --env-file .env.local ai-travel-planner
```

## 🔧 Development Tips

### Seed Test Data

Manually insert a test user in Supabase SQL Editor:

```sql
INSERT INTO users (name, email, password)
VALUES ('Test User', 'test@example.com', 'password123');
```

**Note**: In production, hash passwords with bcrypt!

### Test OpenAI Integration

The app uses GPT-4 Turbo for best results. If costs are a concern, switch to GPT-3.5 in `src/lib/openai.ts`:

```typescript
model: 'gpt-3.5-turbo',  // instead of gpt-4-turbo-preview
```

### Debug Authentication

Check session in any Server Component:

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
console.log(session);
```

### Clear Redux State

Redux state is local only (not persisted). Refresh page to reset.

## � Deployment to Vercel

### Prerequisites
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free at [vercel.com](https://vercel.com))

### Option 1: Deploy via CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy to production:**
```bash
vercel --prod
```

4. **Add environment variables:**
```bash
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add AI_PROVIDER production
vercel env add GEMINI_API_KEY production
```

Or add them all via the Vercel dashboard.

### Option 2: Deploy via Vercel Dashboard

1. **Push code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-travel-planner.git
git push -u origin main
```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure environment variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `NEXTAUTH_URL` → `https://your-app.vercel.app`
     - `NEXTAUTH_SECRET` → (your secret from openssl)
     - `NEXT_PUBLIC_SUPABASE_URL` → (your Supabase URL)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → (your anon key)
     - `SUPABASE_SERVICE_ROLE_KEY` → (your service key)
     - `AI_PROVIDER` → `gemini` or `openai`
     - `GEMINI_API_KEY` → (your Gemini key)

4. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes for build
   - Your app is live! 🎉

### Post-Deployment

**Update NEXTAUTH_URL:**
```bash
vercel env add NEXTAUTH_URL production
# Enter: https://your-app.vercel.app
```

**Redeploy to apply changes:**
```bash
vercel --prod
```

### Automatic Deployments

Connect your Git repository for automatic deployments:
- Every push to `main` → Production deployment
- Every PR → Preview deployment

### Custom Domain (Optional)

1. Go to Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain

## �🐛 Troubleshooting

### OpenAI API Errors

**Error**: "Insufficient credits"
- Add payment method to OpenAI account
- Check billing limits

**Error**: "Rate limit exceeded"
- Wait a few minutes
- Upgrade OpenAI plan

### Supabase Connection Issues

**Error**: "Invalid API key"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys
- Check Supabase project status

**Error**: "Row level security policy violation"
- Ensure user is authenticated
- Check RLS policies in Supabase dashboard

### Authentication Not Working

**Error**: "Invalid credentials"
- Verify user exists in database
- Check password (currently plain text, use bcrypt in production)

**Session not persisting:**
- Ensure `NEXTAUTH_SECRET` is set
- Check cookies are enabled in browser

### Build Errors

**TypeScript errors:**
```bash
npm run build
```
- Fix type errors before deploying

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 14.0.4 | React framework |
| react | 18.2.0 | UI library |
| typescript | 5.3.3 | Type safety |
| next-auth | 4.24.5 | Authentication |
| @supabase/supabase-js | 2.39.1 | Database client |
| openai | 4.24.1 | AI itinerary generation |
| @reduxjs/toolkit | 2.0.1 | State management |
| recharts | 2.10.3 | Charts and analytics |
| tailwindcss | 3.4.0 | Styling |
| date-fns | 3.0.6 | Date formatting |

## 🎨 Customization

### Change Color Theme

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#your-color',
    // ... 100-900
  }
}
```

### Add More Interests

Edit `src/app/(dashboard)/trips/create/page.tsx`:

```typescript
const INTEREST_OPTIONS = [
  'Your New Interest',
  // ... existing interests
];
```

### Modify AI Prompt

Edit `src/lib/openai.ts` to customize itinerary style:

```typescript
const prompt = `You are an expert travel planner...
// Add your custom instructions here
`;
```

## 🚀 Next Steps & Enhancements

### Nice-to-Have Features
- [ ] **Streaming AI Responses**: Real-time itinerary generation
- [ ] **Dark Mode**: Toggle theme preference
- [ ] **PDF Export**: Download trips as PDF
- [ ] **Image Integration**: Unsplash API for destination photos
- [ ] **Rate Limiting**: Prevent API abuse
- [ ] **Trip Sharing**: Share itineraries with friends
- [ ] **Favorites**: Bookmark favorite activities
- [ ] **Budget Alerts**: Notify when over budget
- [ ] **Multi-currency**: Support different currencies
- [ ] **Weather Integration**: Show weather forecasts
- [ ] **Google Maps**: Embed maps for locations
- [ ] **Social Login**: OAuth with Google, GitHub
- [ ] **Email Notifications**: Trip reminders
- [ ] **Collaborative Planning**: Multi-user trips

### Performance Optimizations
- [ ] Implement React Query for caching
- [ ] Add incremental static regeneration (ISR)
- [ ] Optimize images with next/image
- [ ] Add service worker for offline support
- [ ] Implement virtual scrolling for long lists

## 📄 License

MIT License - feel free to use this project for your portfolio or learning.

## 👨‍💻 Author

**Harjot Singh** - Full Stack Developer

Showcasing expertise in:
- Next.js 14 App Router architecture
- AI integration with OpenAI
- TypeScript and type safety
- Server Actions and Server Components
- Database design with Supabase
- State management with Redux Toolkit
- Data visualization with Recharts
- Authentication with NextAuth.js
- Modern UI/UX with Tailwind CSS

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 API
- **Supabase** for PostgreSQL database
- **Vercel** for Next.js framework
- **Recharts** for beautiful charts

---

**Ready to start planning?** Run `npm run dev` and create your first AI-powered trip! 🌍✈️
