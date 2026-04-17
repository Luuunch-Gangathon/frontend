# Frontend — Spherecast Supply Chain Co-Pilot

Next.js 16 + React 19 + Tailwind v4, consuming the FastAPI backend in `../backend`.

Contract: [`knowledge/api-contract.md`](./knowledge/api-contract.md).
Agent-facing notes: [`CLAUDE.md`](./CLAUDE.md).

## Quick start

```bash
cp .env.local.example .env.local      # first time only
yarn install                           # or npm install
yarn gen:types                         # requires backend on :8000
yarn dev                               # http://localhost:3000
```

`yarn gen:types` wraps `openapi-typescript` against `http://localhost:8000/openapi.json` and overwrites `lib/types.generated.ts`. Re-run whenever `backend/app/schemas/` changes.

Set `NEXT_PUBLIC_USE_MOCKS=1` in `.env.local` to develop against `lib/mocks.ts` without a live backend.
