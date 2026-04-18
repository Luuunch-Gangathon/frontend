# API Contract — Frontend ↔ Backend

Source of truth for the HTTP surface between the Next.js frontend and the FastAPI backend.

**Type flow:** Backend Pydantic models (`backend/app/schemas/`) are the source of truth. FastAPI publishes them at `/openapi.json`; the frontend runs `yarn gen:types` (wraps `openapi-typescript`) to regenerate `frontend/lib/types.generated.ts`. A hand-maintained facade `frontend/lib/types.ts` re-exports REST types with clean names.

**Base URL (dev):** `http://localhost:8000`
**CORS:** backend must allow `http://localhost:3000`.
**Transport:** JSON.
**Errors:** non-2xx returns `{ detail: string }` (FastAPI default) — frontend surfaces as `ApiError.body`.

---

## Phase 1 — Current Requirements

Everything required to ship the hackathon demo. All endpoints are **read-only** on the frontend.

### Endpoint summary

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/health` | Liveness probe |
| 2 | GET | `/ingredients` | Legacy smoke-test template (keep until backend drops it) |
| 3 | GET | `/proposals` | List proposals, sorted by `fragmentation_score` desc |
| 4 | GET | `/proposals/{id}` | Single proposal |
| 5 | GET | `/companies` | List portfolio companies |
| 6 | GET | `/companies/{id}` | Single company |
| 7 | GET | `/products` | List finished goods (optional `?company_id=`) |
| 8 | GET | `/products/{id}` | Single product |
| 9 | GET | `/products/{id}/bom` | Bill of materials for a product |
| 10 | GET | `/raw-materials` | List all raw materials |
| 11 | GET | `/raw-materials/{id}` | Single raw material |
| 12 | GET | `/suppliers` | List all suppliers |
| 13 | GET | `/suppliers/{id}` | Single supplier |
| 14 | GET | `/substitutions` | Known raw-material substitutions |
| 15 | GET | `/agnes/suggestions?proposal_id=...` | Pre-seeded questions for a proposal |
| 16 | POST | `/agnes/ask` | Ask Agnes a free-form question about a proposal |

---

### `GET /health`
Liveness probe. Returns `{ "status": "ok" }`. Defined inline in `app/main.py`.

### `GET /ingredients`
Legacy smoke-test template. List ingredients, optionally filtered.

Query params:
| name | type | required | notes |
|---|---|---|---|
| `name` | string | no | case-insensitive substring match on `name` or `canonical_name` |
| `company_id` | string | no | exact match |

Response: `Ingredient[]`

```ts
interface Ingredient {
  id: string;
  name: string;
  canonical_name?: string | null;
  company_id: string;
  sku?: string | null;
}
```

---

### `GET /proposals`
List all proposals, sorted by `fragmentation_score` descending.

Response: `Proposal[]`

```ts
type ProposalKind = 'optimization' | 'substitution'

interface Proposal {
  id: string
  kind: ProposalKind
  headline: string
  summary: string
  raw_material_id: string
  proposed_action: string
  companies_involved: string[]
  current_suppliers: string[]
  proposed_supplier_id?: string | null
  proposed_substitute_raw_material_id?: string | null
  fragmentation_score: number
  tradeoffs: { gained: string[]; atRisk: string[] }
  conservative: { affected_skus: string[]; timeline: string }
  aggressive: { affected_skus: string[]; timeline: string }
  evidence: EvidenceItem[]
  estimated_impact: string
  compliance_requirements: ComplianceRequirement[]
}

interface EvidenceItem {
  claim: string
  source: string
  url?: string | null
  confidence?: 'high' | 'medium' | 'low'
  source_type?: 'internal' | 'supplier' | 'regulator' | 'industry'
}

interface ComplianceRequirement {
  label: string
  status: 'met' | 'gap' | 'partial'
  note?: string | null
}
```

### `GET /proposals/{id}`
Single proposal by ID. Returns 404 if not found.

---

### `GET /companies`
List all portfolio companies.

Response: `Company[]`

```ts
interface Company { id: string; name: string }
```

### `GET /companies/{id}`
Single company. Returns 404 if not found.

---

### `GET /products`
List finished goods, optionally filtered.

Query params:
| name | type | required | notes |
|---|---|---|---|
| `company_id` | string | no | exact match |

Response: `Product[]`

```ts
interface Product { id: string; sku: string; company_id: string }
```

### `GET /products/{id}`
Single product. Returns 404 if not found.

### `GET /products/{id}/bom`
Bill of materials for a product.

Response: `BOM`

```ts
interface BOM {
  id: string
  produced_product_id: string
  consumed_raw_material_ids: string[]
}
```

---

### `GET /raw-materials`
List all raw materials.

Response: `RawMaterial[]`

```ts
interface RawMaterial { id: string; sku: string }
```

### `GET /raw-materials/{id}`
Single raw material. Returns 404 if not found.

---

### `GET /suppliers`
List all suppliers.

Response: `Supplier[]`

```ts
interface Supplier { id: string; name: string }
```

### `GET /suppliers/{id}`
Single supplier. Returns 404 if not found.

---

### `GET /substitutions`
List all known raw-material substitutions.

Response: `Substitution[]`

```ts
interface Substitution {
  id: string
  from_raw_material_id: string
  to_raw_material_id: string
  reason: string
}
```

---

### `GET /agnes/suggestions`
Suggested questions for a given proposal, pre-seeded from the AI analysis.

Query params:
| name | type | required | notes |
|---|---|---|---|
| `proposal_id` | string | yes | matches `Proposal.id` |

Response: `AgnesSuggestedQuestion[]`

```ts
interface AgnesSuggestedQuestion {
  id: string
  question: string
}
```

### `POST /agnes/ask`
Ask Agnes a free-form question about a proposal.

Request body: `AgnesAskRequest`

```ts
interface AgnesAskRequest {
  proposal_id: string
  message: string
  history?: AgnesMessage[]
}
```

Response: `AgnesAskResponse`

```ts
interface AgnesAskResponse {
  reply: AgnesMessage
}

interface AgnesMessage {
  role: 'user' | 'assistant'
  content: string
  reasoning_steps?: string[]
  cited_evidence_indices?: number[]
}
```

---

## Phase 2 — Future Requirements: Supply Tuning

Deferred until Phase 1 is fully shipped. Adds a write path (manual per-supplier quantity allocations) and a recomputation step that returns refreshed proposals based on the new allocation distribution.

**Frontend code is kept in the repo, commented out** — see `app/tuning/page.tsx`, `lib/types.ts`, `lib/api.ts`, `lib/mocks.ts`, and `lib/demo-data.ts` for the `SupplierAllocation` / `TuningRequest` / `TuningResponse` blocks marked `v2:`. Uncomment + restore the `Tuning` nav entry in `components/layout/nav-tabs.tsx` to revive.

### Endpoint summary

| # | Method | Path | Description |
|---|---|---|---|
| 1 | GET | `/tuning/allocations` | Current per-supplier quantity allocations |
| 2 | POST | `/tuning/allocations` | Commit updated allocations; returns refreshed allocations + proposals |

---

### `GET /tuning/allocations`
Current per-supplier quantity allocations.

Response: `SupplierAllocation[]`

```ts
interface SupplierAllocation {
  supplier_id: string
  raw_material_id: string
  quantity_kg: number
}
```

### `POST /tuning/allocations`
Commit updated allocations. Returns refreshed allocations and proposals (proposals may change because fragmentation scores are recomputed from allocation distribution).

Request body: `TuningRequest`

```ts
interface TuningRequest {
  allocations: SupplierAllocation[]
}
```

Response: `TuningResponse`

```ts
interface TuningResponse {
  allocations: SupplierAllocation[]
  proposals: Proposal[]
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
   Add a named re-export in `frontend/lib/types.ts` (`export type Foo = S['Foo']`), a typed function in `frontend/lib/api.ts` modeled on `getIngredients`, and a mock case in `frontend/lib/mocks.ts` keyed on the path. Add a button in `frontend/app/page.tsx` to smoke-test it.

---

## Conventions

- **IDs are strings.** Backend may use UUIDs or slugs — never raw ints. Fixture IDs use `ing_<n>`, `co_<n>`, etc. DB-sourced rows are namespaced with `_db` (`ing_db_<n>`).
- **Nullability is explicit.** Optional fields are `?: T | null`, not `T | undefined`. Pydantic `Optional[T] = None` is the intended mirror.
- **Dates are ISO-8601 strings** (none yet — flag if added).
- **Schema changes: backend-first.** Edit the Pydantic model, restart uvicorn, the frontend re-runs `yarn gen:types` and commits `lib/types.generated.ts`. Ping the other team if the change is breaking.

---

## Resolved decisions

1. **ID scheme** — string slugs. Fixtures use `ing_<n>`; DB rows use `_db` infix.
2. **Error envelope** — FastAPI default `{ "detail": "..." }`. No custom wrapper.
3. **Pagination** — none. Data volume doesn't require it for the hackathon.
4. **Auth** — none. No headers required.
