# API Contract — Frontend ↔ Backend

Source of truth for the HTTP surface between the Next.js frontend and the FastAPI backend.

**Type flow:** Backend Pydantic models (`backend/app/schemas/`) are the source of truth. FastAPI publishes them at `/openapi.json`; the frontend runs `yarn gen:types` (wraps `openapi-typescript`) to regenerate `frontend/lib/types.generated.ts`. A hand-maintained facade `frontend/lib/types.ts` re-exports REST types with clean names.

**Base URL (dev):** `http://localhost:8000`
**CORS:** backend must allow `http://localhost:3000`.
**Transport:** JSON.
**Errors:** non-2xx returns `{ detail: string }` (FastAPI default) — frontend surfaces as `ApiError.body`.

---

## Current endpoints

The repo ships with **one template endpoint** so both teams can wire up the full pipeline (schema → router → repo → fixture → TS types → frontend call). Add new endpoints alongside it using the same layering.

### `GET /health`
Liveness probe. Returns `{ "status": "ok" }`. Defined inline in `app/main.py`.

### `GET /ingredients`
List ingredients, optionally filtered.

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
