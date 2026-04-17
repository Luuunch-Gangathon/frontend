import type {
  ComplianceResult,
  ConsolidationGroup,
  EvidenceBundle,
  Ingredient,
  Supplier,
} from '@/lib/types';

const ingredients: Ingredient[] = [
  { id: 'ing_1', name: 'Soy Lecithin', canonical_name: 'lecithin', company_id: 'co_1', sku: 'SKU-001' },
  { id: 'ing_2', name: 'Sunflower Lecithin', canonical_name: 'lecithin', company_id: 'co_2', sku: 'SKU-002' },
  { id: 'ing_3', name: 'Magnesium Stearate', canonical_name: 'magnesium-stearate', company_id: 'co_1', sku: 'SKU-003' },
];

const suppliersByIngredient: Record<string, Supplier[]> = {
  ing_1: [
    { id: 'sup_1', name: 'Jost Chemical', certifications: ['ISO 9001', 'Kosher'], lead_time_days: 21, moq: 500, country: 'US' },
    { id: 'sup_2', name: 'PureBulk', certifications: ['Organic'], lead_time_days: 14, moq: 250, country: 'US' },
  ],
  ing_2: [
    { id: 'sup_3', name: 'Cargill', certifications: ['Non-GMO', 'Kosher'], lead_time_days: 30, moq: 1000, country: 'US' },
  ],
  ing_3: [
    { id: 'sup_4', name: 'Peter Greven', certifications: ['ISO 9001'], lead_time_days: 28, moq: 500, country: 'DE' },
  ],
};

const consolidationGroups: ConsolidationGroup[] = [
  {
    id: 'cg_1',
    canonical_name: 'lecithin',
    ingredient_ids: ['ing_1', 'ing_2'],
    supplier_count: 3,
    fragmentation_score: 0.72,
    company_ids: ['co_1', 'co_2'],
  },
];

const evidenceBundle: EvidenceBundle = {
  summary: 'Sunflower lecithin is a common allergen-free substitute for soy lecithin.',
  items: [
    {
      claim: 'Sunflower lecithin functions as an emulsifier equivalent to soy lecithin.',
      source_url: 'https://example.com/lecithin-substitution',
      source_type: 'web',
      confidence: 0.86,
      snippet: 'Sunflower lecithin performs equivalently in emulsification applications...',
    },
    {
      claim: 'Three Spherecast companies source soy lecithin; one sources sunflower.',
      source_url: null,
      source_type: 'internal_db',
      confidence: 1.0,
      snippet: null,
    },
  ],
};

const complianceResult: ComplianceResult = {
  pass: true,
  requirements: ['allergen-free', 'non-GMO'],
  evidence: evidenceBundle,
};

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

  const suppliersMatch = p.match(/^\/ingredients\/([^/]+)\/suppliers$/);
  if (suppliersMatch) {
    return (suppliersByIngredient[suppliersMatch[1]] ?? []) as unknown as T;
  }

  if (p === '/consolidation-groups') {
    return consolidationGroups as unknown as T;
  }

  const cgMatch = p.match(/^\/consolidation-groups\/([^/]+)$/);
  if (cgMatch) {
    const cg = consolidationGroups.find((g) => g.id === cgMatch[1]);
    if (!cg) throw new Error(`mock: consolidation group ${cgMatch[1]} not found`);
    return cg as unknown as T;
  }

  if (p.startsWith('/enrich/')) {
    return evidenceBundle as unknown as T;
  }

  if (p === '/compliance-check') {
    return complianceResult as unknown as T;
  }

  if (p === '/suppliers/rank') {
    return (suppliersByIngredient.ing_1 ?? []) as unknown as T;
  }

  throw new Error(`mock: no handler for ${path}`);
}

export function mockChatStream(): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const frames = [
    { type: 'text', content: 'Looking into lecithin consolidation across the portfolio…' },
    { type: 'tool_call', name: 'get_consolidation', args: { canonical_name: 'lecithin' } },
    { type: 'tool_result', name: 'get_consolidation', result: consolidationGroups[0] },
    { type: 'text', content: '\nThree companies source soy lecithin; one sources sunflower.' },
    { type: 'evidence', items: evidenceBundle.items },
    { type: 'done' },
  ] as const;

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const frame of frames) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(frame)}\n\n`));
        await new Promise((r) => setTimeout(r, 200));
      }
      controller.close();
    },
  });
}
