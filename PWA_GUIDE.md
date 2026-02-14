# PWA Installation Guide

LifeBoard is now a **Progressive Web App**! This means you can install it on your phone/desktop like a native app.

## ✨ Features

- **Installable** on iOS, Android, and Desktop
- **Standalone mode** - Fullscreen without browser UI
- **Offline support** - Access cached data without internet
- **Fast loading** - Static assets cached for performance
- **App shortcuts** - Quick access to Tasks, Stats, and Nastia dashboard

---

## 📱 Installation

### iOS (iPhone/iPad)

1. Open **lifeboard.vercel.app** in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Name it "LifeBoard" (or anything you like)
5. Tap **"Add"**

The LifeBoard icon will appear on your home screen!

### Android

1. Open **lifeboard.vercel.app** in Chrome
2. Tap the **three-dot menu** (⋮) in the top-right
3. Tap **"Add to Home screen"** or **"Install app"**
4. Confirm the installation

The app will be installed and accessible from your app drawer.

### Desktop (Chrome/Edge)

1. Open **lifeboard.vercel.app** in Chrome or Edge
2. Look for the **install icon** (⊕) in the address bar
3. Click it and confirm installation

The app will open in a standalone window without browser tabs.

---

## 🧪 Testing PWA Locally

### Development Server

```bash
npm run dev
# Visit http://localhost:3000
```

**Note:** Service Workers require **HTTPS** or **localhost** to register. Development on localhost works fine.

### Testing Service Worker

1. Open **Chrome DevTools** (F12)
2. Go to **Application** tab
3. Click **Service Workers** in the left sidebar
4. You should see the service worker registered for `http://localhost:3000`

### Testing Manifest

1. In DevTools **Application** tab
2. Click **Manifest** in the left sidebar
3. Verify all fields (name, icons, theme_color, etc.)
4. Check "Add to home screen" compatibility

### Testing Offline Mode

1. In DevTools **Application** → **Service Workers**
2. Check **"Offline"** checkbox
3. Navigate through the app - cached pages should load
4. API calls will fail (expected) but static pages work

---

## 🔧 PWA Files

- **`/public/manifest.json`** - App metadata (name, icons, theme)
- **`/public/sw.js`** - Service Worker (caching strategy)
- **`/public/icon-*.png`** - App icons (192x192, 512x512)
- **`/src/components/ServiceWorkerRegistration.tsx`** - SW lifecycle management
- **`/src/app/layout.tsx`** - PWA meta tags

---

## 🚀 Production Deployment

After deploying to Vercel:

1. Visit your production URL (e.g., `lifeboard.vercel.app`)
2. Verify the manifest is accessible: `/manifest.json`
3. Verify the service worker: `/sw.js`
4. Install the app on your device

**Important:** Service Workers only work on **HTTPS** in production. Vercel automatically provides HTTPS.

---

## 🎯 App Shortcuts

The PWA includes app shortcuts for quick navigation:

- **Quick Add Task** → `/tasks`
- **View Stats** → `/stats`
- **Nastia Dashboard** → `/nastia`

On Android, **long-press the app icon** to see shortcuts.

---

## 📊 PWA Auditing

Use **Lighthouse** in Chrome DevTools to audit PWA compliance:

1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Select **"Progressive Web App"** category
4. Click **"Generate report"**

Target: **90+ score** for production readiness.

---

## 🐛 Troubleshooting

### Service Worker not registering

- Check console for errors
- Ensure you're on **localhost** or **HTTPS**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### "Add to Home Screen" not showing

- Verify manifest.json is accessible
- Check manifest in DevTools Application tab
- iOS requires Safari (Chrome doesn't support it)
- Android requires Chrome or Edge

### Offline mode not working

- Service Worker needs time to cache assets on first visit
- Navigate through pages at least once while online
- Check cached assets in DevTools → Application → Cache Storage

### Icons not displaying

- Verify icons exist: `/icon-192.png` and `/icon-512.png`
- Clear browser cache and reinstall the app
- Check manifest.json icon paths

---

## 📝 Next Steps

Potential PWA enhancements:

- **Push notifications** for reminders (cron alerts)
- **Background sync** for offline data submission
- **Share target** to add tasks from other apps
- **Periodic background sync** for data updates

---

**Alex, tu peux maintenant installer LifeBoard sur ton téléphone en Thaïlande et l'utiliser comme une vraie app! 🔥**
