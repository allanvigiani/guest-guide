# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # dev server (Next.js)
npm run build        # production build
npm run start        # run production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)

# Database
npx prisma migrate dev   # apply migrations + regenerate client
npx prisma db push       # push schema without migration history
npx prisma db seed       # seed FLN001, GRM001, RIO001, MRC001
npx prisma studio        # GUI for the DB
```

## Environment variables

Required in `.env` (never `.env.local` — the seed script reads `.env`):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AI_API_KEY` | Anthropic API key |
| `AI_MODEL` | Model string — currently `claude-sonnet-4-6` |

`src/lib/env.ts` validates these at startup with Zod; missing vars throw immediately.

## Architecture

### Stack
- **Next.js 16.2.6** App Router with React 19 — async Server Components are the default. Read `node_modules/next/dist/docs/` before touching routing or data-fetching patterns, as this version has breaking changes from what training data covers.
- **Prisma 7 + Neon serverless adapter** — the client requires the `PrismaNeon` adapter and `ws` for WebSocket support. The generated client lives in `src/generated/prisma/` (not `node_modules/@prisma/client`).
- **Tailwind CSS 4** — uses `@import "tailwindcss"` (not `@tailwind base/components/utilities`). All colours are CSS custom properties (`--sz-*`) defined in `globals.css`; use those variables, not Tailwind colour names.
- **Anthropic SDK** — singleton in `src/lib/ai.ts` (global caching pattern for dev HMR). Model is read from `env.AI_MODEL`.

### Domain structure

```
src/domain/
  property/     — repository (findByCode, findAll), service (getPropertyByCode → 404s via notFound()), types
  experiences/  — repository (findByPropertyId, upsertExperiences), service (getOrGenerateExperiences), types
  chat/         — service (buildChatPayload) for streaming assistant chat
```

Each domain has `*.repository.ts` (DB access), `*.service.ts` (business logic), `*.types.ts` (interfaces). Services never import other services — they can import repositories from other domains if needed.

### Experiences generation flow

`getOrGenerateExperiences(property)` in `experiences.service.ts`:
1. `findExperiencesByPropertyId` — return cached DB row if it exists
2. Call Claude via `aiClient.messages.create` with `EXPERIENCES_SYSTEM_PROMPT`
3. Parse JSON response, `upsertExperiences` to DB, return

The Server Component (`ExperiencesSection`) adds a 2-second artificial delay **only on cache hits** to preserve the skeleton loading UX (`findExperiencesByPropertyId` is called again before `getOrGenerateExperiences`). AI generation has natural latency so no delay is added there.

The component is wrapped in `<Suspense fallback={<ExperiencesSkeleton />}>` in `[propertyCode]/page.tsx`, enabling streaming SSR.

### Page layout

- `/` — property listing grid, fetches all properties server-side
- `/[propertyCode]` — guest guide, two-column layout on `lg+`: left = property info (access, rules, amenities, wifi, host), right = AI experiences

### Styling conventions

Always use the `--sz-*` CSS variables via inline `style={{}}` props or Tailwind's arbitrary value syntax. Do not use Tailwind semantic colour names (`text-blue-500`, etc.) — the design system is entirely in the CSS variables.
