# API Contract — Frontend ↔ Backend

Source of truth for the HTTP surface between the Next.js frontend and the FastAPI backend. Frontend stub types live in `frontend/lib/types.ts` (auto-generated from Pydantic once `scripts/generate_ts_types.py` is wired up). Until then, the hand-written stubs in that file MUST match the shapes below.

**Base URL (dev):** `http://localhost:8000`
**CORS:** backend must allow `http://localhost:3000`.
**Transport:** JSON everywhere except `POST /chat` which is SSE (`text/event-stream`).
**Errors:** non-2xx returns `{ detail: string }` or `{ error: string, code?: string }` — frontend surfaces both as `ApiError.body`.

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

All types are declared in `frontend/lib/types.ts` and should be mirrored 1:1 by Pydantic models in `backend/app/schemas/`.

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
```

---

## 5. Conventions

- **IDs are strings.** Backend may use UUIDs or slugs — never raw ints. If this changes, ping `#frontend` before merging.
- **Nullability is explicit.** Optional fields are `?: T | null`, not `T | undefined`. Pydantic `Optional[T] = None` is the intended mirror.
- **Dates are ISO-8601 strings** (we have none yet — flag if added).
- **Confidence scores in `[0.0, 1.0]`.** Anything outside is a bug.
- **Schema changes require a Slack ping.** `backend/app/schemas/` is shared. P5 re-runs `generate_ts_types.py` and commits `frontend/lib/types.ts`.

---

## 6. Open questions for the backend team

1. ID scheme — UUIDs, slugs (`ing_<name>`), or ints cast to strings? Pick one, document it.
2. `Message` tool role — does it carry `tool_call_id`? Confirm OpenAI-style or custom.
3. Error envelope — default FastAPI `{detail}`, or wrap as `{error, code}`?
4. `ComplianceInput` — is `ingredient_id` the right key, or should it accept a raw name?
5. Pagination — do we need `limit`/`offset` on `/ingredients`, `/consolidation-groups` at current data volume?
6. Auth — confirmed no auth for the hackathon, no headers required?
