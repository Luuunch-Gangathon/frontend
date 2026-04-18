import { API_BASE_URL, USE_MOCKS } from '@/lib/env';
import { mockResponse } from '@/lib/mocks';
import type {
  Company,
  Product,
  RawMaterial,
  Supplier,
  BOM,
  Substitution,
  Proposal,
  AgnesSuggestedQuestion,
  AgnesAskRequest,
  AgnesAskResponse,
} from '@/lib/types';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  if (USE_MOCKS) return mockResponse<T>(path, init);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = await res.text().catch(() => null);
    }
    throw new ApiError(`${res.status} ${res.statusText} — ${path}`, res.status, body);
  }

  return (await res.json()) as T;
}

function qs(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v != null && v !== '') sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : '';
}

// ─── Proposals ────────────────────────────────────────────────────────────────

export function getProposals(): Promise<Proposal[]> {
  return req<Proposal[]>('/proposals');
}

export function getProposal(id: number): Promise<Proposal> {
  return req<Proposal>(`/proposals/${id}`);
}

// ─── Companies ────────────────────────────────────────────────────────────────

export function getCompanies(): Promise<Company[]> {
  return req<Company[]>('/companies');
}

export function getCompany(id: number): Promise<Company> {
  return req<Company>(`/companies/${id}`);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function getProducts(params: { company_id?: number } = {}): Promise<Product[]> {
  return req<Product[]>(`/products${qs(params)}`);
}

export function getProduct(id: number): Promise<Product> {
  return req<Product>(`/products/${id}`);
}

// ─── Raw Materials ────────────────────────────────────────────────────────────

export function getRawMaterials(): Promise<RawMaterial[]> {
  return req<RawMaterial[]>('/raw-materials');
}

export function getRawMaterial(id: number): Promise<RawMaterial> {
  return req<RawMaterial>(`/raw-materials/${id}`);
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export function getSuppliers(): Promise<Supplier[]> {
  return req<Supplier[]>('/suppliers');
}

export function getSupplier(id: number): Promise<Supplier> {
  return req<Supplier>(`/suppliers/${id}`);
}

// ─── Substitutions ────────────────────────────────────────────────────────────

export function getSubstitutions(): Promise<Substitution[]> {
  return req<Substitution[]>('/substitutions');
}

// ─── BOM ──────────────────────────────────────────────────────────────────────

export function getBom(productId: number): Promise<BOM> {
  return req<BOM>(`/products/${productId}/bom`);
}

// ─── Tuning (v2: deferred post-hackathon) ────────────────────────────────────
// export function getSupplierAllocations(): Promise<SupplierAllocation[]> {
//   return req<SupplierAllocation[]>('/tuning/allocations');
// }
// export function applyTuning(body: TuningRequest): Promise<TuningResponse> {
//   return req<TuningResponse>('/tuning/allocations', { method: 'POST', body: JSON.stringify(body) });
// }

// ─── Agnes ────────────────────────────────────────────────────────────────────

export function getAgnesSuggestions(proposalId: number): Promise<AgnesSuggestedQuestion[]> {
  return req<AgnesSuggestedQuestion[]>(`/agnes/suggestions?proposal_id=${proposalId}`);
}

export function askAgnes(body: AgnesAskRequest): Promise<AgnesAskResponse> {
  return req<AgnesAskResponse>('/agnes/ask', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
