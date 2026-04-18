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
    const numId = parseInt(proposalId, 10);
    const found = PROPOSALS.find((o) => o.id === numId);
    if (!found) throw Object.assign(new Error('Not found'), { status: 404 });
    return found as unknown as T;
  }

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
    const numPid = parseInt(pid, 10);
    return (AGNES_SUGGESTED_QUESTIONS[numPid] ?? []) as unknown as T;
  }

  if (p === '/agnes/ask' && init?.method === 'POST') {
    await new Promise((r) => setTimeout(r, 480)); // total ~600ms with leading delay
    const body = JSON.parse(init.body as string) as { proposal_id: number; message: string; session_id?: string | null };
    const session_id = body.session_id ?? `mock-session-${body.proposal_id}-${Date.now()}`;
    const canned = AGNES_CANNED_RESPONSES[body.proposal_id] ?? [];
    const lower = body.message.toLowerCase();
    const match = canned.find((entry) =>
      entry.keywords.some((k) => lower.includes(k.toLowerCase()))
    );
    if (match) return { reply: match.reply, session_id } as unknown as T;
    return {
      reply: {
        role: 'assistant',
        content: "I don't have specific data on that yet — try one of the suggested questions above, where my analysis is most complete.",
        reasoning_steps: ['No keyword match found in canned response library for this proposal.'],
      },
      session_id,
    } as unknown as T;
  }

  throw new Error(`mock: no handler for ${path}`);
}
