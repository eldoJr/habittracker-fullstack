# Habit Tracker - MVP

Build consistent habits through intelligent tracking, streak mechanics, and behavioral insights.

## Tech Stack (Simplified for Solo Dev)

```
┌─────────────────────────────────────┐
│      Next.js 14 (App Router)        │
│  • Server Components                │
│  • Server Actions                   │
│  • PWA Support                      │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│         Supabase Backend            │
│  • PostgreSQL (partitioned)         │
│  • Auth (email + OAuth)             │
│  • Real-time subscriptions          │
│  • Row Level Security               │
└─────────────────────────────────────┘
```

## MVP Feature Roadmap

| Feature | Priority | Complexity | Status |
|---------|----------|------------|--------|
| User auth (Email + OAuth) | P0 | Low | ✅ Done |
| CRUD habits with flexible scheduling | P0 | Medium | 🚧 In Progress |
| Daily check-in with offline support | P0 | High | 📋 Todo |
| Basic streak tracking | P0 | Low | ✅ Done (DB) |
| Push notifications | P0 | Medium | 📋 Todo |
| Simple analytics dashboard | P1 | Medium | 📋 Todo |
| Data export (JSON/CSV) | P1 | Low | 📋 Todo |
| Habit categories/tags | P1 | Low | 📋 Optional |
| Social features (friends) | P2 | High | 🔮 Post-MVP |
| AI coaching insights | P2 | High | 🔮 Post-MVP |
| Wearable integration | P3 | High | 🔮 Post-MVP |

## Database Features

- ✅ Partitioned tables (monthly) for scalability
- ✅ Materialized views for streak calculation
- ✅ Auto-partition creation via pg_cron
- ✅ Row Level Security
- ✅ Helper functions for analytics
- ✅ Optimized indexes

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase credentials

# Run migration in Supabase SQL Editor
# File: supabase-migration.sql

# Start dev server
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # Auth pages
│   ├── (dashboard)/  # Protected pages
│   └── api/          # API routes
├── components/       # UI components (Atomic Design)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── features/
├── lib/
│   ├── actions/      # Server Actions
│   ├── queries/      # Database queries
│   ├── supabase/     # Supabase clients
│   └── validations/  # Zod schemas
└── types/            # TypeScript types
```