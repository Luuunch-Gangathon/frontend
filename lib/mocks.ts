import {
  COMPANIES,
  PRODUCTS,
  RAW_MATERIALS,
  SUPPLIERS,
  BOMS,
  getSuppliersForRawMaterial,
  getFinishedGoodsUsingRawMaterial,
  getCompaniesUsingRawMaterial,
} from '@/lib/demo-data';

function idMatch(path: string, prefix: string): string | null {
  if (!path.startsWith(prefix + '/')) return null;
  const rest = path.slice(prefix.length + 1);
  if (!rest || rest.includes('/')) return null;
  return rest;
}

export async function mockResponse<T>(path: string, init?: RequestInit): Promise<T> {
  await new Promise((r) => setTimeout(r, 120));
  const [p, query] = path.split('?');
  const params = new URLSearchParams(query ?? '');

  // ─── Companies ───────────────────────────────────────────────────────────
  if (p === '/companies') return COMPANIES as unknown as T;

  const companyId = idMatch(p, '/companies');
  if (companyId) {
    const numId = parseInt(companyId, 10);
    const found = COMPANIES.find((c) => c.id === numId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Products ─────────────────────────────────────────────────────────────
  if (p === '/products') {
    const cid = params.get('company_id');
    const numCid = cid ? parseInt(cid, 10) : null;
    const out = numCid != null ? PRODUCTS.filter((pr) => pr.company_id === numCid) : PRODUCTS;
    return out as unknown as T;
  }

  const productBomMatch = p.match(/^\/products\/([^/]+)\/bom$/);
  if (productBomMatch) {
    const numPid = parseInt(productBomMatch[1], 10);
    const bom = BOMS.find((b) => b.produced_product_id === numPid);
    if (!bom) throw Object.assign(new Error('Not found'), { status: 404 });
    return bom as unknown as T;
  }

  const productId = idMatch(p, '/products');
  if (productId) {
    const numId = parseInt(productId, 10);
    const found = PRODUCTS.find((pr) => pr.id === numId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Raw Materials ────────────────────────────────────────────────────────
  if (p === '/raw-materials') return RAW_MATERIALS as unknown as T;

  const rmSuppliersMatch = p.match(/^\/raw-materials\/([^/]+)\/suppliers$/);
  if (rmSuppliersMatch) {
    const numId = parseInt(rmSuppliersMatch[1], 10);
    return getSuppliersForRawMaterial(numId) as unknown as T;
  }

  const rmFinishedGoodsMatch = p.match(/^\/raw-materials\/([^/]+)\/finished-goods$/);
  if (rmFinishedGoodsMatch) {
    const numId = parseInt(rmFinishedGoodsMatch[1], 10);
    return getFinishedGoodsUsingRawMaterial(numId) as unknown as T;
  }

  const rmCompaniesMatch = p.match(/^\/raw-materials\/([^/]+)\/companies$/);
  if (rmCompaniesMatch) {
    const numId = parseInt(rmCompaniesMatch[1], 10);
    return getCompaniesUsingRawMaterial(numId) as unknown as T;
  }

  const rawMaterialId = idMatch(p, '/raw-materials');
  if (rawMaterialId) {
    const numId = parseInt(rawMaterialId, 10);
    const found = RAW_MATERIALS.find((r) => r.id === numId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Suppliers ────────────────────────────────────────────────────────────
  if (p === '/suppliers') return SUPPLIERS as unknown as T;

  const supplierId = idMatch(p, '/suppliers');
  if (supplierId) {
    const numId = parseInt(supplierId, 10);
    const found = SUPPLIERS.find((s) => s.id === numId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Agnes ────────────────────────────────────────────────────────────────
  if (p === '/agnes/ask' && init?.method === 'POST') {
    await new Promise((r) => setTimeout(r, 480));
    const session_id = `mock-session-${Date.now()}`;
    return {
      reply: {
        role: 'assistant',
        content: "Mock mode is active. Connect to the live backend to use the tool-calling agent.",
      },
      session_id,
      tool_calls: [],
    } as unknown as T;
  }

  // ─── Decisions ────────────────────────────────────────────────────────────
  if (p === '/decisions' && init?.method === 'POST') {
    return { id: 1, ...JSON.parse(init.body as string) } as unknown as T;
  }
  if (p === '/decisions') {
    return [] as unknown as T;
  }

  throw new Error(`mock: no handler for ${path}`);
}
