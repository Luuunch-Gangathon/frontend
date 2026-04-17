import type { Ingredient } from '@/lib/types';

const ingredients: Ingredient[] = [
  { id: 'ing_1', name: 'Soy Lecithin', canonical_name: 'lecithin', company_id: 'co_1', sku: 'SKU-001' },
  { id: 'ing_2', name: 'Sunflower Lecithin', canonical_name: 'lecithin', company_id: 'co_2', sku: 'SKU-002' },
  { id: 'ing_3', name: 'Magnesium Stearate', canonical_name: 'magnesium-stearate', company_id: 'co_1', sku: 'SKU-003' },
];

export async function mockResponse<T>(path: string, _init?: RequestInit): Promise<T> {
  await new Promise((r) => setTimeout(r, 120));
  const [p, query] = path.split('?');

  if (p === '/ingredients') {
    const params = new URLSearchParams(query ?? '');
    const name = params.get('name')?.toLowerCase();
    const companyId = params.get('company_id');
    let out = ingredients;
    if (name) out = out.filter((i) => i.name.toLowerCase().includes(name));
    if (companyId) out = out.filter((i) => i.company_id === companyId);
    return out as unknown as T;
  }

  throw new Error(`mock: no handler for ${path}`);
}
