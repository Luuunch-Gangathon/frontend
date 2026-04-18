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
| 2 | GET | `/proposals` | List proposals, sorted by `fragmentation_score` desc |
| 3 | GET | `/proposals/{id}` | Single proposal |
| 4 | GET | `/companies` | List portfolio companies |
| 5 | GET | `/companies/{id}` | Single company |
| 6 | GET | `/products` | List finished goods (optional `?company_id=`) |
| 7 | GET | `/products/{id}` | Single product |
| 8 | GET | `/products/{id}/bom` | Bill of materials for a product |
| 9 | GET | `/raw-materials` | List all raw materials |
| 10 | GET | `/raw-materials/{id}` | Single raw material |
| 11 | GET | `/suppliers` | List all suppliers |
| 12 | GET | `/suppliers/{id}` | Single supplier |
| 13 | GET | `/substitutions` | Known raw-material substitutions |
| 14 | GET | `/agnes/suggestions?proposal_id=...` | Pre-seeded questions for a proposal |
| 15 | POST | `/agnes/ask` | Ask Agnes a free-form question about a proposal |

---

### `GET /health`
Liveness probe. Returns `{ "status": "ok" }`. Defined inline in `app/main.py`.

---

### `GET /proposals`
List all proposals, sorted by `fragmentation_score` descending.

Response: `Proposal[]`

```ts
// Two proposal types the AI generates:
//  - 'optimization'  → consolidate existing suppliers / contracts without changing the material
//  - 'substitution'  → swap one raw material for a functionally equivalent one
type ProposalKind = 'optimization' | 'substitution'

interface Proposal {
  id: number                                         // Postgres integer PK
  kind: ProposalKind                                 // see ProposalKind above
  headline: string                                   // one-line title shown on the proposal card
  summary: string                                    // 1–2 sentence elevator pitch ("why this matters")
  raw_material_id: number                            // FK → RawMaterial.id — the raw material this proposal is about
  proposed_action: string                            // concrete recommendation, e.g. "Consolidate all 8 companies onto Jost Chemical"
  companies_involved: number[]                       // FKs → Company.id — which portfolio companies are affected
  current_suppliers: number[]                        // FKs → Supplier.id — who currently supplies this material today
  proposed_supplier_id?: number | null               // FK → Supplier.id — only set for 'optimization' (single target supplier)
  proposed_substitute_raw_material_id?: number | null // FK → RawMaterial.id — only set for 'substitution' (the replacement material)

  // 0–100 score: how fragmented the current supply is across the portfolio.
  // High score = many suppliers buying the same material across many companies (big consolidation upside).
  // Low score  = already concentrated / well-aligned. Proposals list is sorted by this desc.
  fragmentation_score: number

  // Human-readable pros/cons of acting on the proposal.
  tradeoffs: {
    gained: string[]  // upside bullets, e.g. "15–18% cost reduction"
    atRisk: string[]  // downside bullets, e.g. "single-source concentration risk"
  }

  // Two rollout options the UI shows side-by-side so the operator can choose risk appetite:
  //  - conservative → phased, lower-risk subset of SKUs, longer timeline
  //  - aggressive   → full portfolio cutover, shorter timeline, higher execution risk
  conservative: {
    affected_skus: string[]  // Product.sku values included in this phase
    timeline: string         // human-readable duration + sequencing notes
  }
  aggressive: {
    affected_skus: string[]  // typically a superset of conservative.affected_skus
    timeline: string
  }

  evidence: EvidenceItem[]                           // numbered citations backing the proposal's claims
  estimated_impact: string                           // headline $ figure, e.g. "$210k–250k/yr savings"
  compliance_requirements: ComplianceRequirement[]   // regulatory/label checklist with per-item status
}

interface EvidenceItem {
  claim: string                                        // the specific assertion being cited (one sentence)
  source: string                                       // where the claim came from (document name, team, dataset)
  url?: string | null                                  // optional deep link to the source document
  confidence?: 'high' | 'medium' | 'low'               // how sure the AI is this claim is reliable
  source_type?: 'internal' | 'supplier' | 'regulator' | 'industry'
  // source_type explains WHO produced the source, so reviewers can judge bias:
  //   internal   → Spherecast's own analysis or portfolio company data
  //   supplier   → the supplier's own dossier/spec sheet (useful but self-interested)
  //   regulator  → FDA, EFSA, Health Canada, etc. (highest authority)
  //   industry   → third-party industry report / trade publication
}

interface ComplianceRequirement {
  label: string                         // the requirement name, e.g. "Halal", "USP", "FDA-registered facility"
  status: 'met' | 'gap' | 'partial'     // met = fully satisfied; gap = not satisfied; partial = satisfied for some SKUs only
  note?: string | null                  // short explanation, especially required when status is 'gap' or 'partial'
}
```

### `GET /proposals/{id}`
Single proposal by ID. Returns 404 if not found.

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
Single company. Returns 404 if not found.

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
  sku: string          // human-facing SKU code shown in UI, e.g. "FG-OMEP-20MG-CAP"
  company_id: number   // FK → Company.id — which portfolio company owns this product
}
```

### `GET /products/{id}`
Single product. Returns 404 if not found.

### `GET /products/{id}/bom`
Bill of materials for a product.

Response: `BOM`

```ts
// BOM = Bill of Materials: the raw-material list required to produce one finished good.
interface BOM {
  id: number                           // Postgres integer PK
  produced_product_id: number          // FK → Product.id — the finished good this BOM builds
  consumed_raw_material_ids: number[]  // FKs → RawMaterial.id — inputs required to build the product
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
  sku: string   // human-facing SKU code, e.g. "RM-MAG-STEARATE"
}
```

### `GET /raw-materials/{id}`
Single raw material. Returns 404 if not found.

---

### `GET /suppliers`
List all suppliers.

Response: `Supplier[]`

```ts
interface Supplier {
  id: number    // Postgres integer PK
  name: string  // display name, e.g. "Jost Chemical"
}
```

### `GET /suppliers/{id}`
Single supplier. Returns 404 if not found.

---

### `GET /substitutions`
List all known raw-material substitutions.

Response: `Substitution[]`

```ts
// A pre-analyzed "this raw material can replace that one" mapping used by substitution proposals.
interface Substitution {
  id: number                    // Postgres integer PK
  from_raw_material_id: number  // FK → RawMaterial.id — the material being replaced
  to_raw_material_id: number    // FK → RawMaterial.id — the functionally equivalent replacement
  reason: string                // short rationale: why the swap works (allergen, compliance, cost, etc.)
}
```

---

### `GET /agnes/suggestions`
Suggested questions for a given proposal, pre-seeded from the AI analysis.

Query params:
| name | type | required | notes |
|---|---|---|---|
| `proposal_id` | number | yes | matches `Proposal.id` |

Response: `AgnesSuggestedQuestion[]`

```ts
// A "canned" question the UI shows as a chip above Agnes's chat input to help the user start.
interface AgnesSuggestedQuestion {
  id: number        // Postgres integer PK
  question: string  // the question text to display, e.g. "Why Jost Chemical specifically?"
}
```

### `POST /agnes/ask`
Ask Agnes a free-form question about a proposal.

Request body: `AgnesAskRequest`

```ts
interface AgnesAskRequest {
  proposal_id: number       // FK → Proposal.id — scopes Agnes's answer to this proposal's context
  message: string           // the user's free-form question
  history?: AgnesMessage[]  // prior turns of the conversation, so follow-ups stay coherent
}
```

Response: `AgnesAskResponse`

```ts
interface AgnesAskResponse {
  reply: AgnesMessage  // always an assistant-role message
}

interface AgnesMessage {
  role: 'user' | 'assistant'        // who sent the message
  content: string                   // the main answer text shown in the chat bubble
  reasoning_steps?: string[] | null // ordered bullet trail of how the AI arrived at the answer (shown collapsed by default)
  cited_evidence_indices?: number[] | null // 0-based indices into Proposal.evidence — lets UI jump back to the cited source
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
// One row = "supplier X currently ships quantity_kg of raw material Y to the portfolio per year".
// The full list is the current sourcing distribution; editing it and POSTing triggers a re-score.
interface SupplierAllocation {
  supplier_id: string      // FK → Supplier.id
  raw_material_id: string  // FK → RawMaterial.id
  quantity_kg: number      // annual volume in kilograms allocated to this supplier for this material
}
```

### `POST /tuning/allocations`
Commit updated allocations. Returns refreshed allocations and proposals (proposals may change because fragmentation scores are recomputed from allocation distribution).

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
  proposals: Proposal[]              // freshly re-scored proposals — fragmentation_score and rankings may shift
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
- **Nullability is explicit.** Optional fields are `?: T | null`, not `T | undefined`. Pydantic `Optional[T] = None` is the intended mirror.
- **Dates are ISO-8601 strings** (none yet — flag if added).
- **Schema changes: backend-first.** Edit the Pydantic model, restart uvicorn, the frontend re-runs `yarn gen:types` and commits `lib/types.generated.ts`. Ping the other team if the change is breaking.

---

## Resolved decisions

1. **ID scheme** — plain Postgres integer PKs, emitted as JSON numbers.
2. **Error envelope** — FastAPI default `{ "detail": "..." }`. No custom wrapper.
3. **Pagination** — none. Data volume doesn't require it for the hackathon.
4. **Auth** — none. No headers required.
