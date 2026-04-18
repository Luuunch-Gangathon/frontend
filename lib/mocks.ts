import {
  COMPANIES,
  PRODUCTS,
  RAW_MATERIALS,
  SUPPLIERS,
  BOMS,
  SUBSTITUTIONS,
  PROPOSALS,
  AGNES_SUGGESTED_QUESTIONS,
  AGNES_CANNED_RESPONSES,
  getProposals,
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

  // ─── Proposals ───────────────────────────────────────────────────────────
  if (p === '/proposals') return getProposals() as unknown as T;

  const proposalId = idMatch(p, '/proposals');
  if (proposalId) {
    const found = PROPOSALS.find((o) => o.id === proposalId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Companies ───────────────────────────────────────────────────────────
  if (p === '/companies') return COMPANIES as unknown as T;

  const companyId = idMatch(p, '/companies');
  if (companyId) {
    const found = COMPANIES.find((c) => c.id === companyId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Products ─────────────────────────────────────────────────────────────
  if (p === '/products') {
    const cid = params.get('company_id');
    const out = cid ? PRODUCTS.filter((pr) => pr.company_id === cid) : PRODUCTS;
    return out as unknown as T;
  }

  const productBomMatch = p.match(/^\/products\/([^/]+)\/bom$/);
  if (productBomMatch) {
    const pid = productBomMatch[1];
    const bom = BOMS.find((b) => b.produced_product_id === pid);
    if (!bom) throw Object.assign(new Error('Not found'), { status: 404 });
    return bom as unknown as T;
  }

  const productId = idMatch(p, '/products');
  if (productId) {
    const found = PRODUCTS.find((pr) => pr.id === productId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Raw Materials ────────────────────────────────────────────────────────
  if (p === '/raw-materials') return RAW_MATERIALS as unknown as T;

  const rawMaterialId = idMatch(p, '/raw-materials');
  if (rawMaterialId) {
    const found = RAW_MATERIALS.find((r) => r.id === rawMaterialId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Suppliers ────────────────────────────────────────────────────────────
  if (p === '/suppliers') return SUPPLIERS as unknown as T;

  const supplierId = idMatch(p, '/suppliers');
  if (supplierId) {
    const found = SUPPLIERS.find((s) => s.id === supplierId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

  // ─── Substitutions ────────────────────────────────────────────────────────
  if (p === '/substitutions') return SUBSTITUTIONS as unknown as T;

  // ─── Tuning (v2: deferred post-hackathon) ────────────────────────────────
  // if (p === '/tuning/allocations') {
  //   if (init?.method === 'POST') return { allocations: SUPPLIER_ALLOCATIONS, proposals: PROPOSALS } as unknown as T;
  //   return SUPPLIER_ALLOCATIONS as unknown as T;
  // }

  // ─── Agnes ────────────────────────────────────────────────────────────────
  if (p === '/agnes/suggestions') {
    const pid = params.get('proposal_id') ?? '';
    return (AGNES_SUGGESTED_QUESTIONS[pid] ?? []) as unknown as T;
  }

  if (p === '/agnes/ask' && init?.method === 'POST') {
    await new Promise((r) => setTimeout(r, 480)); // total ~600ms with leading delay
    const body = JSON.parse(init.body as string) as { proposal_id: string; message: string };
    const canned = AGNES_CANNED_RESPONSES[body.proposal_id] ?? [];
    const lower = body.message.toLowerCase();
    const match = canned.find((entry) =>
      entry.keywords.some((k) => lower.includes(k.toLowerCase()))
    );
    if (match) return { reply: match.reply } as unknown as T;
    return {
      reply: {
        role: 'assistant',
        content: "I don't have specific data on that yet — try one of the suggested questions above, where my analysis is most complete.",
        reasoning_steps: ['No keyword match found in canned response library for this proposal.'],
      },
    } as unknown as T;
  }

  throw new Error(`mock: no handler for ${path}`);
}

