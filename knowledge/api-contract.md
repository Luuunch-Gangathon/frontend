# API Contract — Frontend ↔ Backend

Source of truth for the HTTP surface between the Next.js frontend and the FastAPI backend.

**Type flow:** Backend Pydantic models (`backend/app/schemas/`) are the source of truth. FastAPI publishes them at `/openapi.json`; the frontend runs `yarn gen:types` (wraps `openapi-typescript`) to regenerate `frontend/lib/types.generated.ts`. A hand-maintained facade `frontend/lib/types.ts` re-exports REST types with clean names.

**Base URL (dev):** `http://localhost:8000`
**CORS:** backend must allow `http://localhost:3000`.
**Transport:** JSON.
**Errors:** non-2xx returns `{ detail: string }` (FastAPI default) — frontend surfaces as `ApiError.body`.

---

## Phase 1 — Current Requirements

Everything required to ship the hackathon demo. The frontend is **chat-first** and product-scoped: each conversation is bound to one finished-good product chosen by the operator.

### Endpoint summary

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/health` | Liveness probe |
| 2 | GET | `/companies` | List portfolio companies |
| 3 | GET | `/companies/{id}` | Single company |
| 4 | GET | `/products` | List finished goods (optional `?company_id=`) |
| 5 | GET | `/products/{id}` | Single product |
| 6 | GET | `/products/{id}/bom` | Bill of materials for a product |
| 7 | GET | `/raw-materials` | List all raw materials |
| 8 | GET | `/raw-materials/{id}` | Single raw material |
| 9 | GET | `/suppliers` | List all suppliers |
| 10 | GET | `/suppliers/{id}` | Single supplier |
| 11 | POST | `/agnes/ask` | Product-scoped chat turn with Agnes |
| 12 | POST | `/decisions` | Record accept/decline on a substitution proposal |
| 13 | GET | `/decisions?session_id=...` | List decisions for a chat session |

---

### `GET /health`
Liveness probe. Returns `{ "status": "ok" }`. Defined inline in `app/main.py`.

---

### `GET /companies`
List all portfolio companies.

Response: `Company[]`

```ts
interface Company {
  id: number    // Postgres integer PK
  name: string  // display name, e.g. "PharmaCo"
}
```

### `GET /companies/{id}`
Single company by ID. 404 if not found.

---

### `GET /products`
List finished goods, optionally filtered.

Query params:
| name | type | required | notes |
|---|---|---|---|
| `company_id` | number | no | exact match |

Response: `Product[]`

```ts
interface Product {
  id: number           // Postgres integer PK
  sku: string          // human-facing SKU code, e.g. "FG-OMEP-20MG-CAP"
  company_id: number   // FK → Company.id
}
```

### `GET /products/{id}`
Single product. 404 if not found.

### `GET /products/{id}/bom`
Bill of materials for a product.

Response: `BOM`

```ts
// BOM = Bill of Materials: the raw-material list required to produce one finished good.
interface BOM {
  id: number                           // Postgres integer PK
  produced_product_id: number          // FK → Product.id
  consumed_raw_material_ids: number[]  // FKs → RawMaterial.id
}
```

---

### `GET /raw-materials`
List all raw materials.

Response: `RawMaterial[]`

```ts
// A raw material is a purchasable input consumed by a BOM to produce a finished good.
interface RawMaterial {
  id: number    // Postgres integer PK
  sku: string   // e.g. "RM-MAG-STEARATE"
}
```

### `GET /raw-materials/{id}`
Single raw material. 404 if not found.

---

### `GET /suppliers`
List all suppliers.

Response: `Supplier[]`

```ts
interface Supplier {
  id: number    // Postgres integer PK
  name: string  // e.g. "Jost Chemical"
}
```

### `GET /suppliers/{id}`
Single supplier. 404 if not found.

---

### `POST /agnes/ask`

Product-scoped chat turn with Agnes.

**Session flow.** The frontend opens a session by sending `product_id` + the first `message` with `session_id: null`. The backend returns a canonical `session_id` the client echoes back on subsequent turns. `product_id` is only meaningful on the first turn — the backend remembers it by `session_id` afterwards (and SHOULD reject mismatched `product_id` on follow-ups).

**Tooling.** Agnes may invoke internal tools (catalog search, compliance scoring, web enrichment) while answering. Their inputs + outputs are returned as `tool_calls[]` alongside the reply so the UI can render rich entity surfaces (sidebar aggregations, inline proposal cards).

Request body: `AgnesAskRequest`

```ts
interface AgnesAskRequest {
  message: string              // the user's free-form question
  session_id?: string | null   // null on first turn; echo back the id returned by the server on follow-ups
  product_id?: number | null   // required on the first turn; ignored on follow-ups (session-scoped)
}
```

Response: `AgnesAskResponse`

```ts
interface AgnesAskResponse {
  reply: AgnesMessage    // always role='assistant'
  session_id: string     // canonical id — client must round-trip on next turn
  tool_calls: ToolCall[] // zero or more tool invocations the model ran this turn
}

interface AgnesMessage {
  role: 'user' | 'assistant'
  content: string                          // markdown — the main answer text
  reasoning_steps?: string[] | null        // ordered bullet trail (optional, shown collapsed)
  cited_evidence_indices?: number[] | null // reserved for future evidence citations
}
```

#### Tool-call envelope

Each `ToolCall` records one tool the model invoked during the turn. The `result` shape is narrowed by `name`.

```ts
type ToolName = 'search' | 'similarity_compliance_check' | 'web_search_enrich'

interface ToolCall {
  name: ToolName
  arguments: Record<string, unknown>  // echoed input, e.g. { query: "whey protein isolate" }
  result: SearchHit[] | ComplianceMatch[] | string[]
  //   'search'                       → SearchHit[]
  //   'similarity_compliance_check'  → ComplianceMatch[]
  //   'web_search_enrich'            → string[]  (candidate raw-material names discovered online)
}

// One catalog hit returned by the semantic search tool.
interface SearchHit {
  raw_material_name: string
  raw_material_id?: number | null   // null if discovered outside the catalog (web-only candidate)
  similarity: number                // 0..1 cosine similarity to the query
  spec?: Record<string, unknown> | null
  companies: string[]               // company names that currently use this raw material
  suppliers: string[]               // supplier names that currently ship this raw material
}

// One candidate substitute scored against compliance + sourcing constraints.
interface ComplianceMatch {
  raw_material_id?: number | null
  raw_material_name: string
  score: number                // 0..100 compliance score — UI bands: ≥70 High, ≥40 Med, else Low
  reasoning: string            // short human-readable rationale (shown on the proposal card)
  similarity: number           // 0..1 semantic similarity to the original material
  companies_affected: string[] // company names whose BOMs would change if this swap is accepted
  suppliers: string[]          // supplier names that ship this candidate today
}
```

---

### `POST /decisions`

Record the operator's accept/decline on a substitution proposal card shown in the chat. Scoped by `session_id` so the same substitution can be re-offered in a later session without collision.

Request body: `DecisionCreate`

```ts
interface DecisionCreate {
  session_id: string                 // from AgnesAskResponse.session_id
  status: 'accepted' | 'declined'
  original_raw_material_name: string // the material being replaced
  substitute_raw_material_name: string
  product_sku?: string               // finished-good SKU whose BOM the swap would affect (optional)
  score: number                      // compliance score at time of decision (0..100 snapshot)
  reasoning: string                  // snapshot of the rationale shown to the operator
}
```

Response: `Decision` (201 Created)

```ts
interface Decision {
  id: number                         // Postgres integer PK
  session_id: string
  status: string                     // echoes 'accepted' | 'declined'
  original_raw_material_name: string
  substitute_raw_material_name: string
  product_sku?: string | null
  score: number
  reasoning: string
}
```

### `GET /decisions`

List all decisions recorded in a given chat session.

Query params:
| name | type | required | notes |
|---|---|---|---|
| `session_id` | string | yes | matches `Decision.session_id` |

Response: `Decision[]`

---

## Phase 2 — Future Requirements: Supply Tuning

Deferred until Phase 1 is fully shipped. Adds a write path (manual per-supplier quantity allocations) and a recomputation step that returns refreshed proposals based on the new allocation distribution.

**Frontend code is kept in the repo, commented out** — see `app/tuning/page.tsx`, `lib/types.ts`, `lib/api.ts`, `lib/mocks.ts`, and `lib/demo-data.ts` for the `SupplierAllocation` / `TuningRequest` / `TuningResponse` blocks marked `v2:`. Uncomment + restore the `Tuning` nav entry in `components/layout/nav-tabs.tsx` to revive.

### Endpoint summary

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/tuning/allocations` | Current per-supplier quantity allocations |
| 2 | POST | `/tuning/allocations` | Commit updated allocations; returns refreshed allocations |

---

### `GET /tuning/allocations`
Current per-supplier quantity allocations.

Response: `SupplierAllocation[]`

```ts
// One row = "supplier X currently ships quantity_kg of raw material Y to the portfolio per year".
interface SupplierAllocation {
  supplier_id: string      // FK → Supplier.id
  raw_material_id: string  // FK → RawMaterial.id
  quantity_kg: number      // annual volume in kilograms allocated to this supplier for this material
}
```

### `POST /tuning/allocations`
Commit updated allocations.

Request body: `TuningRequest`

```ts
interface TuningRequest {
  allocations: SupplierAllocation[]  // full replacement list — client sends the complete new distribution, not a diff
}
```

Response: `TuningResponse`

```ts
interface TuningResponse {
  allocations: SupplierAllocation[]  // echoed back (canonical post-save state)
}
```

---

## Template pattern — adding a new endpoint

Every new endpoint follows the same five-step recipe:

### Backend side

1. **Schema** — add a Pydantic model in `backend/app/schemas/<domain>.py`. Register it in `backend/app/schemas/__init__.py`.
2. **Data access** — add a function in `backend/app/data/repo.py`. Load fixtures via `backend/app/data/fixtures.py` (JSON under `tests/fixtures/`). DB-sourced rows should use a `_db` namespace to avoid collision with fixture IDs.
3. **Router** — create `backend/app/api/<domain>.py`, define an `APIRouter`, always set `response_model=` so the schema appears in `/openapi.json`.
4. **Wire** — `app.include_router(...)` in `backend/app/main.py`.

### Frontend side

5. **Regenerate + consume** — restart uvicorn, then from `frontend/`:
   ```bash
   yarn gen:types           # pulls types from /openapi.json
   ```
   Add a named re-export in `frontend/lib/types.ts` (`export type Foo = S['Foo']`), a typed function in `frontend/lib/api.ts` modeled on `getRawMaterials`, and a mock case in `frontend/lib/mocks.ts` keyed on the path.

---

## Conventions

- **IDs are integers.** Plain Postgres `PRIMARY KEY` values emitted as JSON numbers. Never string slugs.
- **Session IDs are strings.** Opaque tokens — client never parses them, just echoes them back.
- **Nullability is explicit.** Optional fields are `?: T | null`, not `T | undefined`. Pydantic `Optional[T] = None` is the intended mirror.
- **Dates are ISO-8601 strings** (none yet — flag if added).
- **Schema changes: backend-first.** Edit the Pydantic model, restart uvicorn, the frontend re-runs `yarn gen:types` and commits `lib/types.generated.ts`. Ping the other team if the change is breaking.

---

## Resolved decisions

1. **ID scheme** — plain Postgres integer PKs, emitted as JSON numbers.
2. **Chat identity** — opaque `session_id: string` returned by the backend on first turn, round-tripped by the client.
3. **Product scope** — conversations are bound to a single `product_id` for their lifetime; operator selects it in the UI before the first turn.
4. **Error envelope** — FastAPI default `{ "detail": "..." }`. No custom wrapper.
5. **Pagination** — none. Data volume doesn't require it for the hackathon.
6. **Auth** — none. No headers required.
