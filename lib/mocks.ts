import {
  COMPANIES,
  PRODUCTS,
  RAW_MATERIALS,
  SUPPLIERS,
  BOMS,
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
  if (p === '/raw-materials') {
    const mocked = RAW_MATERIALS.map((r) => ({
      name: r.sku.replace(/^RM-[A-Z0-9]+-/, '').toLowerCase(),
      supplier_count: 1,
      product_count: 1,
    }));
    return mocked as unknown as T;
  }

  const rawMaterialName = idMatch(p, '/raw-materials');
  if (rawMaterialName) {
    const name = decodeURIComponent(rawMaterialName);
    const found = RAW_MATERIALS.find((r) =>
      r.sku.toLowerCase().includes(name.toLowerCase())
    );
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return {
      name,
      supplier_count: 1,
      product_count: 1,
    } as unknown as T;
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
