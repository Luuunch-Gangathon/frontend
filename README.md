# Frontend — Spherecast Supply Chain Co-Pilot

Next.js 16 + React 19 + Tailwind v4. Talks to the FastAPI backend (sibling repo: clone it next to this one as `../backend`).

- **Contract (source of truth):** [`knowledge/api-contract.md`](./knowledge/api-contract.md)
- **Agent-facing notes:** [`CLAUDE.md`](./CLAUDE.md), [`AGENTS.md`](./AGENTS.md)
- **Backend repo:** `../backend` — see its README for startup.

## Quick start

```bash
cp .env.local.example .env.local      # first time only
yarn install                           # or npm install
yarn gen:types                         # requires backend on :8000
yarn dev                               # http://localhost:3000
```

`yarn gen:types` wraps `openapi-typescript` against `http://localhost:8000/openapi.json` and overwrites `lib/types.generated.ts`. Re-run whenever `backend/app/schemas/` changes.

## Scripts

| Script | What it does |
|---|---|
| `yarn dev` | Next dev server on `:3000` |
| `yarn build` | Production build |
| `yarn start` | Serve the production build |
| `yarn lint` | ESLint |
| `yarn gen:types` | Regenerate `lib/types.generated.ts` from `http://localhost:8000/openapi.json` |

## Environment

Configure in `.env.local`:

```env
API_BASE_URL=http://localhost:8000
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000   # only if a client component hits the backend directly
```

`API_BASE_URL` is read server-side (`lib/env.ts`, `app/api/chat/route.ts`). Client-side fetches normally go through Server Components or the SSE proxy.

## Routes

| Path | Purpose |
|---|---|
| `/` | Chat workspace — main co-pilot surface |
| `/intro` | Keynote-style presentation deck |
| `/dictionary` | Catalog index |
| `/dictionary/{raw-materials,products,suppliers,companies,substitutions}` | Catalog tables |
| `/{raw-materials,products,suppliers,companies}/[id]` | Detail pages |
| `/tuning` | Prompt / model tuning console |

The deck order (`components/intro/presentation.tsx`): **Brand → Team → Problem → Requirements → Cost → Architecture → Feature → Macbook**. Navigate with `→` / `Space` / click, `←` to go back, `Esc` to skip. The final slide zooms into the live app.

## Layout

```
app/                        Next.js App Router pages
├── page.tsx                Chat workspace root
├── intro/                  Presentation deck (/intro)
├── dictionary/             Catalog tables
├── {raw-materials,products,suppliers,companies}/[id]/   Detail pages
├── tuning/                 Tuning console
└── api/chat/               SSE proxy to the backend
components/
├── blocks/                 Feature-level composites (chat-workspace, tables, detail views)
├── intro/                  Presentation slides + shell
├── layout/                 AppShell, NavTabs
└── ui/                     shadcn primitives
lib/
├── api.ts                  One typed function per endpoint
├── env.ts                  API_BASE_URL resolution
├── types.ts                Hand-maintained facade over generated types
└── types.generated.ts      openapi-typescript output — DO NOT hand-edit
```

## Type flow

- `lib/types.generated.ts` — raw `openapi-typescript` output, nested `components['schemas']['RawMaterial']` shape. Marked `linguist-generated` so GitHub suppresses the diff; use `git diff --text lib/types.generated.ts` to inspect.
- `lib/types.ts` — re-exports the generated schemas with clean short names (`RawMaterial`, `Proposal`, …). Add a line here whenever the backend ships a new schema you want to consume by its short name.
- `lib/api.ts` — one typed function per endpoint. `getRawMaterials` is the canonical pattern. Shared `ApiError` + `req<T>()` helper.

## Adding an endpoint

See [`knowledge/api-contract.md`](./knowledge/api-contract.md) for the full recipe. TL;DR:

1. `yarn gen:types` to pull the new schema.
2. Re-export it from `lib/types.ts`.
3. Add a typed fetcher in `lib/api.ts` matching `getRawMaterials`.
4. Call it from a Server Component or route handler.
5. Render.

## Stack

- **Next.js 16.2.4** — App Router, React 19, Server Components.
- **Tailwind CSS 4** — `@tailwindcss/postcss`, OKLCH color space, `tw-animate-css`.
- **shadcn** + **Radix UI** primitives.
- **openapi-typescript** for type generation.
- **react-markdown** for streamed assistant output.

> ⚠️ This is Next.js 16. APIs, conventions, and file structure differ from older versions. Before writing new code, check the relevant guide under `node_modules/next/dist/docs/` and heed deprecation notices.
