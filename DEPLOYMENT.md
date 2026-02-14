# LifeBoard - Deployment Guide

**Target Platform:** Vercel  
**Database:** PostgreSQL (Vercel Postgres recommended)  
**Framework:** Next.js 14

---

## Prerequisites

1. GitHub account with this repo pushed
2. Vercel account (free tier works)
3. PostgreSQL database (Vercel Postgres or external)

---

## Quick Deploy to Vercel

### Option 1: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import this GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Add **Vercel Postgres** storage:
   - In project settings → Storage → Create Database
   - Select "Postgres" → Create
   - Vercel auto-injects `POSTGRES_PRISMA_URL` env var
6. Add environment variable:
   - Key: `DATABASE_URL`
   - Value: `${POSTGRES_PRISMA_URL}` (references the auto-injected var)
7. Deploy!

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add Vercel Postgres via dashboard, then redeploy
vercel --prod
```

---

## Database Setup

### Migrate Schema to Production

After deploying with Postgres connected:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to production database
npx prisma db push

# (Optional) Seed production data
npx prisma db seed
```

Or run these commands in Vercel's deployment (add as build step).

---

## Environment Variables

Required in Vercel project settings:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `${POSTGRES_PRISMA_URL}` | References Vercel Postgres auto-injected var |

If using external Postgres (Supabase, Neon, Railway):

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | Full connection string |

---

## Post-Deployment

### 1. Initialize Database

Run in your local terminal (pointing to production DB):

```bash
# Set production DATABASE_URL temporarily
export DATABASE_URL="your-production-postgres-url"

# Push schema
npx prisma db push

# Seed initial data (actors, projects)
npx prisma db seed
```

Or create a seed script and run it via Vercel's terminal.

### 2. Seed Initial Data

Create actors (Alex, Nastia, Jimmy) and projects:

```bash
cd lifeboard
npx prisma db seed
```

If no seed script exists, use Prisma Studio:

```bash
npx prisma studio
```

Then manually create:
- **Actors:** alex, nastia, jimmy
- **Projects:** LifeBoard, TradePilot, OpenClaw Academy

### 3. Test

Visit your Vercel URL:
- `/` - Dashboard should load with empty stats
- `/tasks` - Task management
- `/videos` - Instagram videos
- `/emails` - Partnership emails
- `/stats` - Work & money stats

---

## Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `lifeboard.yourdomain.com`)
3. Configure DNS records as instructed by Vercel

---

## Troubleshooting

### Build Fails

- Check Vercel build logs
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Verify `NODE_ENV=production` doesn't break anything

### Database Connection Error

- Verify `DATABASE_URL` is set correctly
- Check Postgres is accessible from Vercel (whitelist IPs if needed)
- Test connection string locally first

### Prisma Client Not Generated

Add to `package.json` scripts:

```json
"postinstall": "prisma generate"
```

This ensures Prisma Client is generated during Vercel build.

---

## Schema Migration (SQLite → PostgreSQL)

Current schema uses SQLite (`file:./dev.db`) for **local development**. For **production deployment**, you MUST use PostgreSQL.

### Steps to Migrate:

1. **Update `prisma/schema.prisma`** (before deploying):

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Commit and push** the schema change to GitHub

3. **Deploy to Vercel** with Postgres configured

4. **Push schema to production DB**:

In Vercel's project terminal or locally (with prod DATABASE_URL):

```bash
npx prisma db push
```

5. **Seed production data**:

```bash
npx prisma db seed
```

**Note:** Existing SQLite data won't auto-migrate. You'll need to:
- Seed the Postgres DB using `prisma/seed.ts`, OR
- Manually export SQLite data and import to Postgres, OR
- Use Prisma Studio to manually create initial records

### Keep SQLite for Local Dev (Recommended)

To avoid needing Postgres locally:

1. Keep `provider = "sqlite"` in schema for dev
2. Use `.env` with `DATABASE_URL="file:./dev.db"`
3. Before deploying, change schema to `provider = "postgresql"`
4. Use Vercel environment variable `DATABASE_URL` pointing to Postgres

**Trade-off:** You'll need to regenerate Prisma Client when switching providers.

---

## Monitoring

- **Vercel Analytics:** Enable in project settings (free)
- **Error Tracking:** Vercel auto-captures errors
- **Database:** Use Vercel Postgres dashboard or external provider's dashboard

---

## Cost Estimate

**Vercel Free Tier:**
- Hobby plan: Free
- Limits: 100 GB bandwidth/month, 100 GB-hours compute
- Perfect for personal use

**Vercel Postgres:**
- Free tier: 256 MB storage (enough for this app)
- Paid: $20/month for 512 MB (only if you exceed free tier)

**Total:** $0/month for light usage!

---

## Next Steps After Deployment

1. **Test all features** (tasks, videos, emails, stats)
2. **Seed production data** (actors, projects)
3. **Configure crons** (if needed for auto-updates)
4. **Share URL with Alex** for feedback
5. **Monitor usage** and scale if needed

---

**Deployment Ready!** 🚀

Questions? Check [Vercel Docs](https://vercel.com/docs) or [Next.js Deployment Guide](https://nextjs.org/docs/deployment).
