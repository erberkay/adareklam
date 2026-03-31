# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server (localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint check
```

No test suite is configured. There is no single-test command.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) automatically builds and deploys to GitHub Pages on every push to `main`. The live site is at `https://erberkay.github.io/adareklam/`.

**GitHub Pages source must be set to "GitHub Actions"** in repo Settings → Pages, not "Deploy from branch".

## Architecture Overview

React 19 + Vite SPA backed by Firebase (Auth, Firestore, Storage). Deployed to GitHub Pages with `base: '/adareklam/'` in `vite.config.js` and `basename="/adareklam"` in `BrowserRouter`.

### Routing & Layout

- `src/App.jsx` — root; wraps everything in `ErrorBoundary > HelmetProvider > BrowserRouter > SmoothScroll`
- `src/components/layout/Layout.jsx` — renders Navbar+Footer for public pages. **Admin (`/admin`) and customer (`/musteri`) routes bypass Layout entirely** (no Navbar/Footer)
- `src/routes/ProtectedRoute.jsx` — requires any authenticated user
- `src/routes/AdminRoute.jsx` — requires `userRole === 'admin'` (reads from Zustand `useAuthStore`)

### State Management (Zustand, `src/store/`)

Three stores:
- `useAuthStore` — Firebase user object + `userRole` (`'admin'|'customer'`) + loading flag
- `useSiteSettingsStore` — mirrors the `siteSettings/config` Firestore doc; also applies `--color-primary` CSS variable dynamically when settings change
- `useUIStore` — sidebar collapsed state + mobile menu open state

`src/hooks/useAuth.js` (`useAuthListener`) and `src/hooks/useSiteSettings.js` (`useSiteSettingsListener`) establish Firestore `onSnapshot` listeners; both are called once in `AppInit` inside `App.jsx`.

### Firebase / Data

- Config: `src/lib/firebase.js` — exports `auth`, `db`, `storage`, `googleProvider`
- Firestore collections: `siteSettings` (single doc `config`), `users`, `services`, `portfolio`, `quotes`, `testimonials`, `contacts`
- `src/hooks/useFirestore.js` — exports `useCollection`, `useDocument` (real-time hooks) and async helpers `addDocument`, `updateDocument`, `deleteDocument`
- `src/hooks/useStorage.js` — `useUpload` hook for Firebase Storage uploads

**First admin setup:** user must log in once (creates `users` doc with `role: 'customer'`), then manually set `role: 'admin'` in Firestore Console.

### Design System

All design tokens are CSS custom properties defined in `src/index.css`. Primary color (`--color-primary`) can be changed at runtime via Admin → Site Ayarları; `useSiteSettingsStore.setSettings` applies it via `document.documentElement.style.setProperty`.

Key CSS classes: `.glass-card`, `.btn-primary`, `.btn-ghost`, `.gradient-text`, `.section-label`, `.heading-section`, `.hero-title`, `.floating-label-group`, `.marquee-track`.

Fonts: Sora (headings) + Inter (body), loaded from Google Fonts in `index.css`.

### Animation

- `src/lib/animations.js` — centralised Framer Motion variant objects (`pageVariants`, `revealVariants`, `staggerContainer`, `staggerItem`, etc.). Reuse these; don't define inline variants for common patterns.
- `src/components/ui/RevealOnScroll.jsx` — wraps children with scroll-triggered reveal; accepts `variant` prop (`'fadeUp'|'fadeLeft'|'fadeRight'|'scaleUp'|'clipReveal'`)
- `src/hooks/useReducedMotion.js` — check before applying heavy animations; HeroSection and CustomCursor already respect it

### Site Settings → UI connection

`siteSettings/config` in Firestore → `useSiteSettingsListener` onSnapshot → `useSiteSettingsStore.setSettings` → components read via `useSiteSettingsStore((s) => s.settings)`. **Never hardcode site name, colors, contact info, or stats** — always read from this store. The `brands` and `heroVideo` fields are part of settings and managed from Admin → Site Ayarları.

### lucide-react Icon Note

Brand icons (Instagram, Facebook, YouTube) are **not available** in the installed version of lucide-react. Use substitutes: `AtSign` for Instagram, `Share2` for Facebook, `PlayCircle` for YouTube.
