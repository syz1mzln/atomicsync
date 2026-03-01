# AtomicSync — Precision Time Reference for Watch Owners

I built this out of a specific frustration: rotating between multiple automatics and having no trustworthy reference to set them against. Phone clocks are imprecise enough to matter. time.is is generic. Nothing exists that understands the watch-setting ritual. AtomicSync is the tool I wanted — NTP-synced, designed for the moment you have a watch in one hand and need a reliable second hand to chase.

## What It Does

- Displays NTP-synchronized time in HH:MM:SS, auto-detected to your local timezone
- DSEG7 segmented display (nixie-amber, dark mode default) — built to read at a glance
- Supports up to 4 secondary timezone displays for GMT and world-time watches
- 4-step watch-setting guide, dismissible, shown on first visit
- **Phase 1.5 — Watch Log:** optional sync logging layer — track which watches you've set and when
- Feature vote + waitlist: cast a vote for what gets built next, join the list

## Who It's For

**Primary:** Mechanical or automatic watch owner with 2+ watches, no winder, actively rotating. Frustrated by constant resetting. Wants a time source that understands the ritual.

**Secondary:** GMT or dual-time watch owner who needs multiple synchronized references when setting complications.

Not for: quartz watch owners, general timekeeping, or anyone who doesn't know what a crown is.

## Getting Started

```bash
cd atomicsync
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Environment variables required:**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Supabase is used for vote aggregation only. The clock runs entirely client-side via NTP fallback chain: `pool.ntp.org → TimeAPI.io → device clock`.

**Deploy:**

```bash
npm run build
```

Deploy via [Vercel](https://vercel.com). No server configuration required — all backend logic runs in Vercel serverless functions.

## Dev Commands

```bash
npm run dev       # start development server
npm run build     # production build
npm run lint      # ESLint (0 errors required before commit)
npm run format    # Prettier — auto-format all files
npm test          # Vitest — run all tests once
npm run test:watch  # Vitest — watch mode
```

## localStorage Keys

| Key                          | Type                  | Purpose                            |
| ---------------------------- | --------------------- | ---------------------------------- |
| `atomictime_time_format_24h` | boolean               | 12h / 24h display preference       |
| `atomictime_dark_mode`       | `'dark'` \| `'light'` | Colour theme preference            |
| `atomictime_timezones`       | JSON `City[]`         | Secondary timezone clocks          |
| `atomictime_last_visit`      | string (epoch ms)     | Enables return-visit tip bar modes |
| `atomictime_watches`         | JSON `Watch[]`        | Phase 1.5 — tracked watches        |
| `atomictime_sync_log`        | JSON `SyncLog[]`      | Phase 1.5 — sync history per watch |

Session-only state (resets on page reload):

| Key                               | Storage          | Purpose                                     |
| --------------------------------- | ---------------- | ------------------------------------------- |
| `atomictime_log_prompt_dismissed` | `sessionStorage` | Hides "Log your watch?" bar for the session |

**Known gap:** Watch removal is immediate with no undo (Phase 3 backlog).

## Phase Roadmap

| Phase | Feature                                                        | Go Signal                                |
| ----- | -------------------------------------------------------------- | ---------------------------------------- |
| 1     | Atomic sync webapp — precision time reference + waitlist       | >200 waitlist signups in 8 weeks         |
| 1.5   | Watch Log — optional sync logging (name watches, log set time) | Shipped — validates logging behaviour    |
| 2     | Watch rotation + winding tracker                               | >50% of beta users log 2+ check-ins/week |
| 3     | Accuracy drift logger + movement benchmarks                    | 30-day retention in beta cohort          |
| 4     | Service logbook + TCO dashboard                                | Return visits driven by service planning |

Phase 2 begins only after Phase 1 go signal is reached. Each phase validates before the next builds.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Font:** DSEG7 Classic Bold (self-hosted, MIT) · JetBrains Mono (Google Fonts)
- **Time sync:** NTP via serverless function, 3-tier fallback
- **Database:** Supabase (votes + waitlist)
- **Analytics:** Plausible (cookieless)
- **Deployment:** Vercel
