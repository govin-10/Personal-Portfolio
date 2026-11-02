# Govinda Timsina, Portfolio

Personal portfolio for a React Native / frontend developer. Next.js App Router,
TypeScript, Tailwind CSS v4, and Sanity as the content dashboard.

**Live:** https://govindatimsina.com.np

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, Cache Components) | Static-by-default rendering with per-function caching |
| Language | TypeScript |, |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | Design tokens live in `app/globals.css` |
| Content | Sanity v6, Studio embedded at `/studio` | Edit content on your own domain, no redeploys |
| Email | Resend | Contact form delivery |
| Hosting | Vercel | Zero-config for the Next.js features used here |

### Why the site works before Sanity is configured

Every page reads through one content layer (`lib/content/index.ts`). If
`NEXT_PUBLIC_SANITY_PROJECT_ID` is missing, it falls back to local seed data in
`lib/content/local.ts`, so a fresh clone builds and runs with zero accounts set
up. In development, a banner reminds you that you're on sample content.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in as you go, nothing is required to boot
npm run dev
```

Open http://localhost:3000.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run sanity:typegen` | Generate TS types from the Sanity schema |

---

## Setting up the content dashboard (Sanity)

The dashboard is already built, it just needs a project to talk to.

**1. Create a Sanity project**

```bash
npx sanity login      # opens a browser; sign in with Google/GitHub
npx sanity init --env # creates a project and writes the env vars
```

Choose **"Use the default dataset configuration" (`production`)**. When asked
about a project template, pick **"Clean project with no predefined schemas"** 
the schemas in `sanity/schemas/` are already written.

If you'd rather do it by hand, create a project at
[sanity.io/manage](https://sanity.io/manage) and copy the project ID into
`.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

**2. Open the Studio**

Restart `npm run dev`, then go to http://localhost:3000/studio and sign in.
You'll see **Projects**, **Blog posts** and **Profile** in the sidebar.

**3. Fill in your Profile first**

It's a single document holding your name, headline, bio, skills, work history,
social links and resume PDF. Until you create it, the site uses the profile in
`lib/content/local.ts` (which is already filled in with your real details).

**4. Add your real projects, then delete the samples**

The three `Sample, …` entries in `lib/content/local.ts` are placeholders and
only ever show when Sanity is disconnected. Once Sanity has projects, they stop
appearing. You can also delete them from that file.

For each project, only the **Overview** tab is required.

**Platforms is the important field.** Tick every surface the project ships on
(iOS / Android / Web). There is deliberately no separate "category" field 
it's derived, so the two can never contradict each other:

| Platforms ticked | Shows under | Badge |
| --- | --- | --- |
| iOS and/or Android | Mobile apps | Mobile |
| Web | Websites | Web |
| Both | **Mobile apps *and* Websites** | Mobile & Web |

Under **Media**, the screenshot fields follow your platform choice: *App
screenshots* (rendered in phone frames) appears once a mobile platform is
ticked, and *Web screenshots* (browser frames) once Web is. A project that is
both gets both fields, and its case study renders an "The app" section followed
by "On the web". Upload raw device screenshots, cropping and compression are
automatic.

**5. Deploy the Studio's CORS origin**

In [sanity.io/manage](https://sanity.io/manage) → your project → **API** →
**CORS origins**, add your production URL (`https://govindatimsina.com.np`)
with credentials allowed. `http://localhost:3000` is usually added for you.

---

## Instant updates (revalidation webhook)

Publishing in the Studio purges only the affected cache tag, so changes appear
without a redeploy.

1. Generate a secret: `openssl rand -base64 32`
2. Add it as `SANITY_REVALIDATE_SECRET` in `.env.local` **and** in Vercel.
3. In [sanity.io/manage](https://sanity.io/manage) → **API** → **Webhooks** →
   *Create webhook*:
   - **URL**: `https://govindatimsina.com.np/api/revalidate`
   - **Dataset**: `production`
   - **Trigger on**: Create, Update, Delete
   - **HTTP method**: `POST`
   - **Secret**: the value from step 1

Document types map to cache tags in `app/api/revalidate/route.ts`.

---

## Contact form email (Resend)

1. Sign up at [resend.com](https://resend.com) and create an API key.
2. Add to `.env.local` and Vercel:

```bash
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=onboarding@resend.dev   # or an address on a domain you verified
```

Without these the form **fails closed** with a "please email me directly"
message rather than silently discarding submissions.

The form has validation, a honeypot field, and a best-effort in-memory rate
limit. On serverless that limit is per-instance, so treat it as friction rather
than a guarantee, add Upstash rate limiting if you ever get hammered.

---

## Deploying to Vercel

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new). Next.js is
   detected automatically, no build settings to change.
3. Add every variable from `.env.example` under **Settings → Environment
   Variables**, including `NEXT_PUBLIC_SITE_URL=https://govindatimsina.com.np`.
4. **Settings → Domains** → add `govindatimsina.com.np`, then update the DNS
   records at your registrar as Vercel instructs.
5. Redeploy so the env vars take effect.

---

## Project structure

```
app/
  (site)/              # public site, shares the header/footer layout
    page.tsx           # home
    projects/          # list + [slug] case studies
    about/ blog/ contact/
  studio/[[...tool]]/  # Sanity Studio, no site chrome
  api/revalidate/      # Sanity webhook -> revalidateTag
  actions/contact.ts   # contact form server action
  globals.css          # design tokens + custom utilities
components/            # UI; most are server components
lib/
  content/             # the content layer
    index.ts           # getProjects/getPosts/getProfile (cached, Sanity-or-local)
    local.ts           # fallback seed content
    queries.ts         # GROQ
    types.ts
  sanity/              # client, env, image helpers
sanity/schemas/        # content models -> generate the Studio UI
legacy/                # the original static site, kept for reference
```

### Caching model

Next 16 Cache Components makes data dynamic by default. Each content function
opts in with `"use cache"`, a `cacheTag` and `cacheLife('days')`. The webhook
calls `revalidateTag(tag, "max")`, so readers are served stale content while a
refresh happens in the background.

---

## Notes

- **Theme**: follows the OS by default, with a manual toggle. Tokens for both
  themes are defined in `app/globals.css`.
- **Scroll reveals** are pure CSS (`components/reveal.tsx`). The base state is
  *visible*, the animation is an enhancement, so content is never stuck hidden
  if JavaScript fails.
- **exFAT volumes**: this repo lives on an external exFAT drive, where macOS
  writes `._*` sidecar files that break Turbopack's cache. `npm run dev` and
  `npm run build` sweep them first via `clean:appledouble`. Harmless elsewhere.
