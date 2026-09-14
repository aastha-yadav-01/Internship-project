# Ledger — reading & watchlist tracker

A personal ledger for what you're reading and watching. Built with Next.js
(App Router), TypeScript, and Tailwind CSS v4.

## Status: Foundations phase

Routes are scaffolded with placeholder/static data. No database or auth yet —
that's a later phase. Server Components are used by default; the add-item
form is the only Client Component, since it's the only screen with real
interactivity right now.

## Routes

| Route         | Screen                          | Type              |
| ------------- | -------------------------------- | ----------------- |
| `/`           | Shelf (library list)             | Server, static     |
| `/item/[id]`  | Item detail                      | Server, static (SSG per item) |
| `/add`        | Add item (placeholder form)      | Server + Client island |
| `/stats`      | Stats summary                    | Server, static     |
| `/health`     | Health check (live fetch)        | Server, dynamic    |

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying to Vercel

1. Push this repo to GitHub (see below).
2. Go to https://vercel.com/new and import the GitHub repo.
3. Framework preset auto-detects as Next.js — no config changes needed.
4. No environment variables are required for this phase. See `.env.example`
   for the structure to follow once one is needed (copy to `.env.local`,
   never commit it — `.gitignore` already excludes `.env*`).
5. Click Deploy. Every subsequent push to any branch gets its own preview
   URL; pushes to `main` update the production URL.

## Pushing to GitHub for the first time

```bash
git init
git add .
git commit -m "Foundations: scaffold routes, tokens, health check"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Design tokens

Defined in `app/globals.css` under `@theme inline`:

- Colors: `page`, `card`, `ink`, `ink-soft`, `stone`, `stamp`, `shelf`, `border`
- Fonts: `--font-serif` (headings), `--font-sans` (body/UI) — system font
  stacks, no external font fetch at build time.

Placeholder data lives in `lib/data.ts`.
