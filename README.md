# LifeBoard 📊

**Personal dashboard for tracking work, projects, and partner schedules.**

Built by Jimmy (AI) for Alex (Human) - Partnership project to get rich together 🔥

---

## 🚀 Features

- **Dashboard** - Real-time planning, project progress, and statistics
- **Task Management** - Track all actions (tasks, emails, videos, etc.)
- **Work & Money Tracking** - Log hours worked and income with charts
- **Instagram Videos** - Manage video content for Alex and Nastia
- **Partnership Emails** - Track outreach campaigns and responses
- **Quick Actions** - Log hours and money directly from the dashboard
- **Charts** - Visualize work hours and income trends over time
- **Planning Integration** - View daily schedule and recurring events

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + React 18 + Tailwind CSS
- **UI Components:** shadcn/ui + Lucide Icons
- **Database:** SQLite (dev) / PostgreSQL (production)
- **ORM:** Prisma 5
- **Charts:** Recharts
- **Deployment:** Vercel

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/jimmybot718-commits/lifeboard.git
cd lifeboard

# Install dependencies
npm install
# or
yarn install

# Create .env file
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma db push

# Seed initial data
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## 📁 Project Structure

```
lifeboard/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Dashboard (homepage)
│   │   ├── tasks/        # Task management
│   │   ├── videos/       # Instagram videos
│   │   ├── emails/       # Partnership emails
│   │   ├── stats/        # Work & money statistics
│   │   └── api/          # API routes
│   └── components/       # React components
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed script
│   └── dev.db            # SQLite database (local)
├── PLANNING.md           # Alex's daily schedule
├── PROGRESS.md           # Development tracker
└── DEPLOYMENT.md         # Deployment guide
```

---

## 🗄️ Database Schema

**Key models:**
- `Actor` - Alex, Nastia, Jimmy (humans + AI)
- `Task` - Dynamic tasks (emails, videos, custom actions)
- `Project` - LifeBoard, TradePilot, Academy, etc.
- `WorkLog` - Hours tracked per actor/project
- `MoneyEntry` - Income/expense tracking
- `ScheduleEntry` - Calendar events
- `InstagramVideo` - Video content for Alex/Nastia
- `PartnershipEmail` - Partnership outreach tracking
- `CronExecution` - Jimmy's automated actions

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
# Local development (SQLite)
DATABASE_URL="file:./dev.db"

# Production (PostgreSQL)
# DATABASE_URL="postgresql://user:password@host:5432/database"
```

See `.env.example` for more details.

---

## 📈 Usage

### Quick Actions (Dashboard)

- **Log Hours:** Select actor, project, hours, and description
- **Log Money:** Enter amount (CHF), description, and optional project

### Task Management

- View all tasks with filters (all/in progress/done)
- Mark tasks as started, completed, or failed
- Delete tasks

### Instagram Videos

- Store video URLs for Alex or Nastia
- Mark videos as posted or keep as drafts
- Delete videos when no longer needed

### Partnership Emails

- Log outreach emails sent
- Track status (sent/replied/interested/rejected)
- Add follow-up notes

### Statistics

- View work hours and income history
- Charts showing daily trends
- Edit or delete entries

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick deploy to Vercel:**

1. Push repo to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add Vercel Postgres storage
4. Set `DATABASE_URL` environment variable
5. Deploy!

---

## 📅 Roadmap

- [x] Task management system
- [x] Instagram video tracking
- [x] Partnership email tracking
- [x] Work & money tracking
- [x] Dashboard with stats
- [x] Quick actions for logging
- [x] Charts visualization
- [x] Edit/delete work & money entries
- [ ] Vercel deployment
- [ ] Mobile responsive improvements
- [ ] Export data (CSV/PDF)
- [ ] Notifications/reminders
- [ ] Planning CRUD (edit schedule from UI)

---

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

---

## 📄 License

MIT - Built with ❤️ by Jimmy & Alex

---

**Deadline:** 15 Feb 2026, 9:00 AM Thailand (2:00 AM UTC)  
**Status:** 🚨 All features complete! Ready for deployment.
