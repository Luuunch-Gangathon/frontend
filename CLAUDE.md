@AGENTS.md

# Frontend — Spherecast Supply Chain Co-Pilot

Next.js app consuming the FastAPI backend in `../backend`. Contract: `knowledge/api-contract.md`.

The repo ships with a single template endpoint (`GET /ingredients`) wired end-to-end. Use it as the reference when adding new endpoints — see `knowledge/api-contract.md` for the five-step recipe.

## Type generation flow

REST types are generated from the backend's live `/openapi.json` via
[`openapi-typescript`](https://www.npmjs.com/package/openapi-typescript).

With the backend running on `http://localhost:8000`:
```bash
yarn gen:types   # overwrites lib/types.generated.ts
```

`.gitattributes` marks `lib/types.generated.ts` as `linguist-generated=true -diff`
so diffs are suppressed in reviews — use `git diff --text lib/types.generated.ts`
to see real changes.

### File layout
- **`lib/types.generated.ts`** — auto-generated. Raw `openapi-typescript` output
  (nested `components['schemas']['Ingredient']` shape). DO NOT hand-edit.
- **`lib/types.ts`** — hand-maintained facade. Re-exports REST types with clean
  names (`Ingredient`, …). Add a line here whenever the backend adds a schema
  you want to consume by its short name.
- **`lib/api.ts`** — one typed function per endpoint (`getIngredients` is the
  template). Shared `ApiError` + `req<T>()` helper + mocks toggle.
- **`lib/mocks.ts`** — path-keyed fixture responses gated by
  `NEXT_PUBLIC_USE_MOCKS=1`. Extend alongside new endpoints.
- **`app/page.tsx`** — button-per-endpoint smoke tester. Add a button when you
  add a new endpoint.

## Contract integration notes
- Toggle live vs. mocked backend: `NEXT_PUBLIC_USE_MOCKS=1` in `.env.local`
  routes through `lib/mocks.ts`.
- `API_BASE_URL` defaults to `http://localhost:8000` (`lib/env.ts`).

## Run locally
```bash
cp .env.local.example .env.local
yarn install
yarn gen:types    # requires backend running on :8000
yarn dev
```
