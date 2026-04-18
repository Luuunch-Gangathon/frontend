import { API_BASE_URL } from '@/lib/env';
import type {
  Company,
  Product,
  RawMaterial,
  Supplier,
  BOM,
  AgnesAskRequest,
  AgnesAskResponse,
  DecisionCreate,
  Decision,
  ComplianceResult,
  SubstituteCandidate,
  SubstituteProposal,
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

export function getRawMaterialSuppliers(id: number): Promise<Supplier[]> {
  return req<Supplier[]>(`/raw-materials/${id}/suppliers`);
}

export function getRawMaterialFinishedGoods(id: number): Promise<Product[]> {
  return req<Product[]>(`/raw-materials/${id}/finished-goods`);
}

export function getRawMaterialCompanies(id: number): Promise<Company[]> {
  return req<Company[]>(`/raw-materials/${id}/companies`);
}

export function getRawMaterialSubstitutes(id: number): Promise<SubstituteCandidate[]> {
  return req<SubstituteCandidate[]>(`/raw-materials/${id}/substitutes`);
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export function getSuppliers(): Promise<Supplier[]> {
  return req<Supplier[]>('/suppliers');
}

export function getSupplier(id: number): Promise<Supplier> {
  return req<Supplier>(`/suppliers/${id}`);
}

// ─── BOM ──────────────────────────────────────────────────────────────────────

export function getBom(productId: number): Promise<BOM> {
  return req<BOM>(`/products/${productId}/bom`);
}

// ─── Compliance ───────────────────────────────────────────────────────────────

export function getCompliance(productId: number): Promise<ComplianceResult[]> {
  return req<ComplianceResult[]>(`/compliance/${productId}`);
}

export function getComplianceForMaterial(
  productId: number,
  rawMaterialId: number,
): Promise<ComplianceResult> {
  return req<ComplianceResult>(`/compliance/${productId}/${rawMaterialId}`);
}

export function scoreSubstituteCandidates(
  productId: number,
  originalRmId: number,
  candidateRmIds: number[],
): Promise<SubstituteProposal[]> {
  return req<SubstituteProposal[]>(
    `/compliance/${productId}/${originalRmId}/candidates`,
    {
      method: 'POST',
      body: JSON.stringify({ candidate_ids: candidateRmIds }),
    },
  );
}

// ─── Agnes ────────────────────────────────────────────────────────────────────

export function askAgnes(body: AgnesAskRequest): Promise<AgnesAskResponse> {
  return req<AgnesAskResponse>('/agnes/ask', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ─── Decisions ────────────────────────────────────────────────────────────────

export function postDecision(body: DecisionCreate): Promise<Decision> {
  return req<Decision>('/decisions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getDecisions(sessionId: string): Promise<Decision[]> {
  return req<Decision[]>(`/decisions?session_id=${encodeURIComponent(sessionId)}`);
}
