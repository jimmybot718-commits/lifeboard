# 🚀 Deploy LifeBoard to Vercel NOW

**Time to deploy:** ~5 minutes  
**Deadline:** 15 fév 2026, 9h Thaïlande (2h UTC) — ~16h from now

---

## ✅ Pre-Deploy Checklist

- ✅ All features implemented and tested
- ✅ Build successful (13 routes)
- ✅ PostgreSQL schema ready
- ✅ Code pushed to GitHub
- ✅ Documentation complete

**Status:** 🟢 READY TO DEPLOY!

---

## 🎯 Quick Deploy Steps (Vercel Dashboard)

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/new

### 2. Import Repository
- Click "Add New Project"
- Select "Import Git Repository"
- Choose: **jimmybot718-commits/lifeboard**
- Click "Import"

### 3. Configure Project
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

**DO NOT DEPLOY YET!** Click "Environment Variables" first ⬇️

### 4. Add Database (Vercel Postgres)
- In the deployment page, scroll down to "Add Storage"
- Click "Create" under **Postgres**
- Select "Create New Database" or use existing
- Vercel auto-injects: `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, etc.

### 5. Set Environment Variable
Add this ONE variable:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `${POSTGRES_PRISMA_URL}` |

**Note:** This references the auto-injected variable from step 4.

### 6. Deploy!
Click **"Deploy"** button

Vercel will:
- Install dependencies
- Generate Prisma Client (`postinstall` script)
- Build Next.js
- Deploy to production

**Deploy time:** ~2-3 minutes

### 7. Get Your URL
After deployment, you'll get:
- **Production URL:** `lifeboard-xxx.vercel.app`
- Or set custom domain later

---

## 📊 Post-Deploy: Initialize Database

Your database is empty! You need to:

### Option A: Prisma Studio (Easiest)

1. Open Vercel project → **Settings** → **Environment Variables**
2. Copy the `POSTGRES_PRISMA_URL` value
3. Run locally:

```bash
export DATABASE_URL="<paste-postgres-url-here>"
cd /home/node/.openclaw/workspace/lifeboard
npx prisma db push
npx prisma db seed
```

### Option B: Manual Entry

Visit your production URL and add initial data:
- Go to `/tasks`, `/videos`, `/emails` and create test entries
- Use "Quick Actions" on dashboard to log hours/money

---

## 🧪 Test Your Deployment

Visit your production URL and test:

- ✅ `/` — Dashboard loads (stats show 0 initially)
- ✅ `/tasks` — Task management works
- ✅ `/videos` — Instagram videos page works
- ✅ `/emails` — Partnership emails works
- ✅ `/stats` — Stats page with charts
- ✅ Quick Actions — Log hours and money from dashboard

All pages should load without errors!

---

## 🎨 Next Steps (After Deployment)

1. **Test all features** — Create tasks, log hours, add videos
2. **Seed data** — Add Actors (Alex, Nastia, Jimmy) and Projects
3. **Share URL** — Show to Alex for feedback
4. **Custom domain** (optional) — Settings → Domains
5. **Monitor** — Vercel dashboard shows analytics

---

## ⚠️ Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`

### Database Connection Error
- Make sure `DATABASE_URL` env var is set correctly
- Verify Postgres database is created and linked

### "Prisma Client not generated"
Already handled! `postinstall` script in `package.json` does this.

### Empty Stats/Dashboard
Normal on first deploy! Add data via:
- Quick Actions (log hours/money)
- `/tasks`, `/videos`, `/emails` pages
- Or seed script (see step 7 above)

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Ask Jimmy (me!) via Telegram

---

**Ready to deploy? LET'S GO!** 🚀

**Deployment URL will be:** `https://lifeboard-<random>.vercel.app`
