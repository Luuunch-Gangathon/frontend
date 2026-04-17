@AGENTS.md

# Frontend — Spherecast Supply Chain Co-Pilot

Next.js app consuming the FastAPI backend in `../backend`. Contract: `knowledge/api-contract.md`.

## Type generation flow

REST types are generated from the backend's live `/openapi.json` via
[`openapi-typescript`](https://www.npmjs.com/package/openapi-typescript).

With the backend running on `http://localhost:8000`:
```bash
npm run gen:types   # overwrites lib/types.generated.ts
```

`.gitattributes` marks `lib/types.generated.ts` as `linguist-generated=true -diff`
so diffs are suppressed in reviews — use `git diff --text lib/types.generated.ts`
to see real changes.

### File layout
- **`lib/types.generated.ts`** — auto-generated. Raw `openapi-typescript` output
  (nested `components['schemas']['Ingredient']` shape). DO NOT hand-edit.
- **`lib/types.ts`** — hand-maintained facade. Re-exports REST types with clean
  names (`Ingredient`, `Supplier`, …) and defines the SSE event types inline.

### What lives where
| Type | Source |
|---|---|
| `SourceType`, `MessageRole`, `Ingredient`, `Supplier`, `ConsolidationGroup`, `EvidenceItem`, `EvidenceBundle`, `Message`, `ComplianceInput`, `ComplianceResult`, `ChatRequest` | generated (re-exported from `lib/types.ts`) |
| `TextEvent`, `ToolCallEvent`, `ToolResultEvent`, `EvidenceEvent`, `TraceEvent`, `DoneEvent`, `ChatEvent` | hand-written in `lib/types.ts` (OpenAPI doesn't describe SSE payloads) |

`lib/sse.ts` re-exports `ChatEvent`.

### If you need a new type
- **REST type**: add the Pydantic model in `backend/app/schemas/`, restart the
  backend, then `npm run gen:types`. Add a re-export line in `lib/types.ts`.
- **New ChatEvent variant**: edit `backend/app/schemas/chat.py` AND the SSE
  block in `lib/types.ts` (kept in sync by hand).

## Contract integration quirks
- `ComplianceResult.pass: boolean` — the wire key is `pass` (not `passed`).
- `POST /chat` is SSE — the browser calls `/api/chat` (Next.js proxy in
  `app/api/chat/route.ts`), which streams from `${API_BASE_URL}/chat`. Parsed
  by `lib/sse.ts::parseSSE` and consumed via `hooks/useChatStream.ts`.
- Toggle live vs. mocked backend: `NEXT_PUBLIC_USE_MOCKS=1` in `.env.local`
  routes through `lib/mocks.ts`.
- `API_BASE_URL` defaults to `http://localhost:8000` (`lib/env.ts`).

## Run locally
```bash
echo 'NEXT_PUBLIC_USE_MOCKS=0' > .env.local
echo 'NEXT_PUBLIC_API_BASE_URL=http://localhost:8000' >> .env.local
npm install
npm run gen:types    # requires backend running on :8000
npm run dev
```
