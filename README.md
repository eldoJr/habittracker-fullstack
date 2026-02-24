# Habit Tracker - Full Stack MVP

Build consistent habits through intelligent tracking, streak mechanics, and behavioral insights. A modern, mobile-first habit tracking application with AI-powered features.

![Habit Tracker Preview](docs/Habit%20Tracker%20-%20Monochrome%20Type.png)

## ✨ Features

### Core Features
- ✅ **User Authentication** - Email + OAuth with Supabase Auth
- ✅ **Habit Management** - Full CRUD with flexible scheduling (daily, weekly, specific days)
- ✅ **Habit Completion** - Quick complete or detailed tracking with duration, mood, and notes
- ✅ **Streak Tracking** - Real-time streak calculation with visual indicators
- ✅ **Analytics Dashboard** - 7-day activity charts, completion rates, and insights
- ✅ **Habit Templates** - Pre-built habit bundles (Morning Routine, Fitness, Learning, etc.)
- ✅ **Profile Management** - User profiles with customizable settings
- ✅ **Data Export** - Export all data as JSON or CSV
- ✅ **Schedule System** - Daily/weekly/monthly event planning

### Design Features
- 🎨 **Mobile-First Design** - Optimized for mobile with responsive desktop views
- 🎨 **Consistent Design System** - `#F4F4F5` backgrounds, `rounded-2xl` styling, gray-900 theme
- 🎨 **Smooth Animations** - Framer Motion for delightful interactions
- 🎨 **Bottom Navigation** - Floating nav bar for easy access

### AI & Future Features
- 🤖 **AI-Powered Insights** - Personalized recommendations (Coming Soon)
- 🤖 **Smart Scheduling** - Optimal habit timing suggestions (Coming Soon)
- 🤖 **Predictive Analytics** - Progress forecasting (Coming Soon)

## 🛠 Tech Stack

```
┌─────────────────────────────────────┐
│      Next.js 14 (App Router)        │
│  • Server Components                │
│  • Server Actions                   │
│  • TypeScript                       │
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

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- React Hot Toast

**Backend:**
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Server Actions
- API Routes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd habittracker-fullstack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a new Supabase project
2. Run migrations in Supabase SQL Editor:
   - `sql/supabase-migration.sql` - Main schema
   - `sql/create-schedule-events.sql` - Schedule system
   - `sql/create-habit-templates.sql` - Habit templates

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── auth/
│   ├── (dashboard)/         # Protected pages
│   │   ├── page.tsx         # Home dashboard
│   │   ├── habits/          # Habit management
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── discover/        # Habit templates
│   │   └── profile/         # User profile
│   └── api/                 # API routes
│       └── export/          # Data export
├── components/
│   ├── atoms/               # Basic UI components
│   ├── features/            # Feature-specific components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── habits/
│   │   ├── analytics/
│   │   ├── discover/
│   │   └── profile/
│   └── ui/                  # Shared UI components
├── lib/
│   ├── actions/             # Server Actions
│   ├── queries/             # Database queries
│   ├── supabase/            # Supabase clients
│   ├── constants/           # App constants
│   └── validations/         # Zod schemas
└── types/                   # TypeScript types
```

## 🗄️ Database Schema

### Core Tables
- `user_profiles` - User profile information
- `habits` - Habit definitions with scheduling
- `habit_completions` - Completion records (partitioned by month)
- `user_streaks` - Streak tracking
- `habit_templates` - Pre-built habit templates
- `schedule_events` - User schedule/calendar

### Key Features
- ✅ Monthly partitioned tables for scalability
- ✅ Row Level Security (RLS) policies
- ✅ Optimized indexes for performance
- ✅ Materialized views for analytics

## 🎨 Design System

### Colors
- Background: `#F4F4F5`
- Primary: `gray-900` (#111827)
- Accent: Custom per habit

### Border Radius
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-2xl` (16px)
- Nav: `rounded-[32px]` (32px)

### Typography
- Headers: `font-extrabold`
- Body: `font-semibold` / `font-medium`

## 📱 Pages

1. **Home Dashboard** - Daily overview with stats, habits, schedule
2. **Habits** - Full habit list with CRUD operations
3. **Analytics** - Charts, insights, and progress tracking
4. **Discover** - AI-powered habit templates and recommendations
5. **Profile** - User settings, notifications, data export

## 🔐 Authentication

- Email/Password authentication
- OAuth providers (Google, GitHub)
- Email verification
- Password reset flow
- Protected routes with middleware

## 📊 Analytics Features

- Current & longest streak tracking
- 7-day activity visualization
- Completion rate calculation
- Best performing habit identification
- Most productive day analysis
- Average mood tracking

## 🚧 Roadmap

- [ ] PWA support with offline mode
- [ ] Push notifications
- [ ] Dark mode
- [ ] Social features (friends, sharing)
- [ ] AI habit coach
- [ ] Wearable integration
- [ ] Multi-language support

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.