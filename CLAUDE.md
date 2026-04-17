@AGENTS.md

# Frontend — Spherecast Supply Chain Co-Pilot

Next.js app consuming the FastAPI backend in `../backend`. Contract: `knowledge/api-contract.md`.

## Type generation flow

**`lib/types.ts` is AUTO-GENERATED from backend Pydantic models.** Do not hand-edit it.

The backend owns shared types. To regenerate:
```bash
cd ../backend
source .venv/bin/activate
python scripts/generate_ts_types.py   # overwrites frontend/lib/types.ts
```
Then commit the regenerated `lib/types.ts` here.

`.gitattributes` marks the file `linguist-generated=true -diff` so git suppresses the diff in reviews — use `git diff --text lib/types.ts` to see real changes.

### What lives in `lib/types.ts`
- Emitted from Pydantic: `SourceType`, `MessageRole`, `Ingredient`, `Supplier`, `ConsolidationGroup`, `EvidenceItem`, `EvidenceBundle`, `Message`, `ComplianceInput`, `ComplianceResult`, `ChatRequest`
- Emitted from a static block in the generator (`CHAT_EVENTS_BLOCK`): `TextEvent`, `ToolCallEvent`, `ToolResultEvent`, `EvidenceEvent`, `TraceEvent`, `DoneEvent`, and the `ChatEvent` discriminated union. `lib/sse.ts` re-exports `ChatEvent`.

### If you need a new type
Do NOT add it to `lib/types.ts` directly. Either:
1. Add a Pydantic model in `backend/app/schemas/` and register it in the generator's `model_order` list, OR
2. If it's a new SSE event variant, update both `backend/app/schemas/chat.py` AND the `CHAT_EVENTS_BLOCK` constant inside `backend/scripts/generate_ts_types.py` (they are kept in sync by hand).

Then regenerate.

## Contract integration quirks
- `ComplianceResult.pass: boolean` — the wire key is `pass` (not `passed`). Already reflected in the generated type.
- `POST /chat` is SSE — the browser calls `/api/chat` (Next.js proxy in `app/api/chat/route.ts`), which streams from `${API_BASE_URL}/chat`. Parsed by `lib/sse.ts::parseSSE` and consumed via `hooks/useChatStream.ts`.
- Toggle live vs. mocked backend: `NEXT_PUBLIC_USE_MOCKS=1` in `.env.local` routes through `lib/mocks.ts`.
- `API_BASE_URL` defaults to `http://localhost:8000` (`lib/env.ts`).

## Run locally
```bash
echo 'NEXT_PUBLIC_USE_MOCKS=0' > .env.local
echo 'NEXT_PUBLIC_API_BASE_URL=http://localhost:8000' >> .env.local
npm run dev
```
