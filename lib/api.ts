import { API_BASE_URL, USE_MOCKS } from '@/lib/env';
import { mockResponse } from '@/lib/mocks';
import type { Ingredient } from '@/lib/types';

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

function qs(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v != null && v !== '') sp.set(k, v);
  const s = sp.toString();
  return s ? `?${s}` : '';
}

// Template helper — mirrors the `GET /ingredients` endpoint on the backend.
// Add one of these per endpoint the backend exposes.
export function getIngredients(params: { name?: string; company_id?: string } = {}): Promise<Ingredient[]> {
  return req<Ingredient[]>(`/ingredients${qs(params)}`);
}
