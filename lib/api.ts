import { API_BASE_URL, USE_MOCKS } from '@/lib/env';
import { mockResponse } from '@/lib/mocks';
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

// ─── Agnes ────────────────────────────────────────────────────────────────────

export function askAgnes(body: AgnesAskRequest): Promise<AgnesAskResponse> {
  return req<AgnesAskResponse>('/agnes/ask', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export interface StreamAgnesCallbacks {
  onSession?: (sessionId: string) => void;
  onToken?: (text: string) => void;
  onToolStart?: (name: string) => void;
  onToolEnd?: (name: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}

type StreamEvent =
  | { type: 'session'; session_id: string }
  | { type: 'token'; text: string }
  | { type: 'tool_start'; name: string }
  | { type: 'tool_end'; name: string }
  | { type: 'done' }
  | { type: 'error'; message: string };

export async function streamAgnes(
  body: AgnesAskRequest,
  callbacks: StreamAgnesCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/agnes/ask/stream`, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    let errBody: unknown = null;
    try {
      errBody = await res.json();
    } catch {
      errBody = await res.text().catch(() => null);
    }
    throw new ApiError(`${res.status} ${res.statusText} — /agnes/ask/stream`, res.status, errBody);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const handle = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let event: StreamEvent;
    try {
      event = JSON.parse(trimmed) as StreamEvent;
    } catch {
      return;
    }
    switch (event.type) {
      case 'session':
        callbacks.onSession?.(event.session_id);
        break;
      case 'token':
        callbacks.onToken?.(event.text);
        break;
      case 'tool_start':
        callbacks.onToolStart?.(event.name);
        break;
      case 'tool_end':
        callbacks.onToolEnd?.(event.name);
        break;
      case 'done':
        callbacks.onDone?.();
        break;
      case 'error':
        callbacks.onError?.(event.message);
        break;
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, nl);
      buffer = buffer.slice(nl + 1);
      handle(line);
    }
  }
  if (buffer) handle(buffer);
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
