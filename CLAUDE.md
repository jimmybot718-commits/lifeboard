# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run seed         # Seed database with initial data
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema changes to database
```

## Architecture Overview

LifeBoard is a personal dashboard app built with Next.js 14 App Router for tracking work, projects, and schedules.

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + React 18 + Tailwind CSS
- **Database**: SQLite (dev) / PostgreSQL (production) via Prisma ORM
- **Charts**: Recharts
- **UI**: Custom components in `src/components/ui/` (button, card, input, select, badge, toast, etc.)

### Data Flow
- Pages use Server Components with `export const dynamic = 'force-dynamic'` to fetch fresh data
- API routes in `src/app/api/` handle mutations (POST, PATCH, DELETE)
- Client components use `fetch()` to call API routes, then trigger page refresh via `router.refresh()`
- Prisma client singleton in `src/lib/prisma.ts` prevents connection exhaustion in dev

### Key Models (prisma/schema.prisma)
- `Actor` - Users: Alex (human), Nastia (human), Jimmy (AI)
- `Task` - Dynamic tasks with type (email, video, news, custom), status (pending/in_progress/done/failed)
- `Project` - Tracked projects with progress percentage
- `WorkLog` - Hours worked per actor/project
- `MoneyEntry` - Income/expense tracking in CHF
- `ScheduleEntry` - Calendar events with start/end times, optional recurring
- `InstagramVideo` - Video content tracking per actor
- `PartnershipEmail` - Outreach email tracking with status
- `Goal` - Work hours or revenue targets with period (daily/weekly/monthly)

### Page Structure
- `/` - Dashboard with stats, quick actions, planning, recent tasks, projects
- `/tasks`, `/videos`, `/emails` - CRUD management pages
- `/stats` - Work hours and income charts with date filtering
- `/schedule` - Calendar/schedule editor
- `/goals` - Goal tracking
- `/projects` - Project management

### API Pattern
Each resource follows a consistent pattern:
- `src/app/api/[resource]/route.ts` - GET (list) and POST (create)
- `src/app/api/[resource]/[id]/route.ts` - GET (single), PATCH (update), DELETE

### Database Setup
SQLite for local development (configured via `DATABASE_URL="file:./dev.db"` in `.env`).
Switch to PostgreSQL for production by changing the Prisma provider and connection string.
