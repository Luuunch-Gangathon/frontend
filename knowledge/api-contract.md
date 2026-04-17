# API Contract — Frontend ↔ Backend

Source of truth for the HTTP surface between the Next.js frontend and the FastAPI backend.

**Type flow:** Backend Pydantic models (`backend/app/schemas/`) are the source of truth. FastAPI publishes them at `/openapi.json`; the frontend runs `npm run gen:types` (wraps `openapi-typescript`) to regenerate `frontend/lib/types.generated.ts`. A hand-maintained facade `frontend/lib/types.ts` re-exports REST types with clean names and defines the SSE event block (which OpenAPI doesn't cover).

**Base URL (dev):** `http://localhost:8000`
**CORS:** backend must allow `http://localhost:3000`.
**Transport:** JSON everywhere except `POST /chat` which is SSE (`text/event-stream`).
**Errors:** non-2xx returns `{ detail: string }` (FastAPI default) — frontend surfaces as `ApiError.body`.

---

## 1. Data endpoints (P1 — Data Layer)

### `GET /ingredients`
List ingredients, optionally filtered.

Query params:
| name | type | required | notes |
|---|---|---|---|
| `name` | string | no | case-insensitive substring match on `name` or `canonical_name` |
| `company_id` | string | no | exact match |

Response: `Ingredient[]`

### `GET /ingredients/{id}/suppliers`
All suppliers associated with a given ingredient.

Path params: `id: string`
Response: `Supplier[]`
404 if ingredient unknown.

### `GET /consolidation-groups`
All consolidation opportunities across the 61 portfolio companies.

Response: `ConsolidationGroup[]`

### `GET /consolidation-groups/{id}`
Single consolidation group, including the ingredient IDs and aggregate stats.

Path params: `id: string`
Response: `ConsolidationGroup`
404 if group unknown.

---

## 2. Agent / chat endpoint (P2 — Agent Core)

### `POST /chat`
Streaming conversational endpoint. Returns Server-Sent Events.

Request body:
```json
{
  "messages": [{ "role": "user", "content": "Which ingredients could we consolidate?" }],
  "session_id": "abc-123"
}
```

Response: `Content-Type: text/event-stream`. Each frame is `data: <JSON>\n\n`. The frontend SSE parser in `frontend/lib/sse.ts` is tolerant of blank lines and ignores `event:`/comment lines, but the backend should emit pure `data:` frames.

Event union (discriminated on `type`):
```ts
| { type: 'text';        content: string }
| { type: 'tool_call';   name: string; args: unknown }
| { type: 'tool_result'; name: string; result: unknown }
| { type: 'evidence';    items: EvidenceItem[] }
| { type: 'trace';       agent?: string; step: string }  // Could Have
| { type: 'done' }
```

Ordering contract:
- `text` may be emitted incrementally (append, don't replace) — frontend concatenates in order.
- Every `tool_call` should be followed by a matching `tool_result` (same `name`).
- `evidence` may appear any time — frontend collects into a running list.
- Always terminate with `{ "type": "done" }` so the frontend releases the stream cleanly.

Proxying: the browser calls `POST /api/chat` on Next.js, which pass-throughs to FastAPI `/chat`. Do not rely on cookies — session is carried in `session_id`.

---

## 3. Enrichment endpoints (P3 — Enrichment)

### `GET /enrich/{ingredient}`
Free-form enrichment of an ingredient — pulls web/scraped evidence. One canonical shape regardless of source.

Path params: `ingredient: string` (canonical name, URL-encoded)
Response: `EvidenceBundle`

### `POST /compliance-check`
Checks whether an ingredient satisfies a list of requirements (organic, allergen-free, halal, kosher, etc.).

Request body: `ComplianceInput`
```json
{ "ingredient_id": "ing_1", "requirements": ["allergen-free", "non-GMO"] }
```
Response: `ComplianceResult`

### `GET /suppliers/rank`
Ranks the suppliers for an ingredient by certifications, lead time, and reliability.

Query params:
| name | type | required |
|---|---|---|
| `ingredient_id` | string | yes |

Response: `Supplier[]` — ordered best-first.

---

## 4. Shared types

Declared once as Pydantic models in `backend/app/schemas/` and regenerated into the frontend via `npm run gen:types` (see the Type flow note at the top). The canonical shapes are listed below; backend is authoritative if they drift.

```ts
type SourceType = 'internal_db' | 'web' | 'inferred' | 'scraped';
type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

interface Ingredient {
  id: string;
  name: string;
  canonical_name?: string | null;
  company_id: string;
  sku?: string | null;
}

interface Supplier {
  id: string;
  name: string;
  certifications: string[];
  lead_time_days?: number | null;
  moq?: number | null;
  country?: string | null;
}

interface ConsolidationGroup {
  id: string;
  canonical_name: string;
  ingredient_ids: string[];
  supplier_count: number;
  fragmentation_score: number;  // 0.0 – 1.0
  company_ids: string[];
}

interface EvidenceItem {
  claim: string;
  source_url?: string | null;
  source_type: SourceType;
  confidence: number;  // 0.0 – 1.0
  snippet?: string | null;
}

interface EvidenceBundle {
  items: EvidenceItem[];
  summary: string;
}

interface Message {
  role: MessageRole;
  content: string;
  tool_call_id?: string | null;
}

interface ComplianceInput {
  ingredient_id: string;
  requirements: string[];
}

interface ComplianceResult {
  pass: boolean;
  requirements: string[];
  evidence: EvidenceBundle;
}

interface ChatRequest {
  messages: Message[];
  session_id: string;
}

interface TextEvent       { type: 'text';        content: string }
interface ToolCallEvent   { type: 'tool_call';   name: string; args: unknown }
interface ToolResultEvent { type: 'tool_result'; name: string; result: unknown }
interface EvidenceEvent   { type: 'evidence';    items: EvidenceItem[] }
interface TraceEvent      { type: 'trace';       agent?: string | null; step: string }
interface DoneEvent       { type: 'done' }

type ChatEvent =
  | TextEvent
  | ToolCallEvent
  | ToolResultEvent
  | EvidenceEvent
  | TraceEvent
  | DoneEvent;
```

---

## 5. Conventions

- **IDs are strings.** Backend may use UUIDs or slugs — never raw ints. If this changes, ping `#frontend` before merging.
- **Nullability is explicit.** Optional fields are `?: T | null`, not `T | undefined`. Pydantic `Optional[T] = None` is the intended mirror.
- **Dates are ISO-8601 strings** (we have none yet — flag if added).
- **Confidence scores in `[0.0, 1.0]`.** Anything outside is a bug.
- **Schema changes: backend-first.** Edit the Pydantic model in `backend/app/schemas/`, restart uvicorn, then the frontend runs `npm run gen:types` and commits the updated `frontend/lib/types.generated.ts`. Ping `#frontend` if the change is breaking.

---

## 6. Resolved decisions

1. **ID scheme** — string slugs. Hand-authored fixtures use `ing_<n>`, `sup_<n>`, `co_<n>`, `cg_<n>`. Rows sourced from `data/db.sqlite` are namespaced with a `_db` infix (`ing_db_<n>`) so they never collide.
2. **`Message.tool_call_id`** — OpenAI-style `Optional[str] = None`.
3. **Error envelope** — FastAPI default `{ "detail": "..." }`. No custom wrapper.
4. **`ComplianceInput`** — keys by `ingredient_id` (not raw name).
5. **Pagination** — none. Data volume doesn't require it for the hackathon.
6. **Auth** — none. No headers required.
7. **`ComplianceResult.pass`** — wire key is `pass` (Python-reserved word). Backend aliases with `Field(alias="pass")` and serialises via `response_model_by_alias=True`.
