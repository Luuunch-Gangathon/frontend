// Hand-maintained domain type facade.
// TODO: once backend publishes new schemas, re-run `yarn gen:types` and swap
// each interface below to `type Foo = S['Foo']` from ./types.generated.

// ─── Core entities ────────────────────────────────────────────────────────────

export interface Company {
  id: string
  name: string
}

export interface Product {
  id: string
  sku: string
  company_id: string
}

export interface RawMaterial {
  id: string
  sku: string
}

export interface Supplier {
  id: string
  name: string
}

export interface BOM {
  id: string
  produced_product_id: string
  consumed_raw_material_ids: string[]
}

export interface SupplierRawMaterial {
  supplier_id: string
  raw_material_id: string
}

// ─── Substitutions ────────────────────────────────────────────────────────────

export interface Substitution {
  id: string
  from_raw_material_id: string
  to_raw_material_id: string
  reason: string
}

// ─── Proposals ────────────────────────────────────────────────────────────────

export type ProposalKind = 'optimization' | 'substitution'

export interface EvidenceItem {
  claim: string
  source: string
  url?: string | null
  confidence?: 'high' | 'medium' | 'low'
  source_type?: 'internal' | 'supplier' | 'regulator' | 'industry'
}

export interface ComplianceRequirement {
  label: string
  status: 'met' | 'gap' | 'partial'
  note?: string | null
}

export interface Proposal {
  id: string
  kind: ProposalKind
  headline: string
  summary: string
  raw_material_id: string
  proposed_action: string
  companies_involved: string[]
  current_suppliers: string[]
  proposed_supplier_id?: string | null
  proposed_substitute_raw_material_id?: string | null
  fragmentation_score: number
  tradeoffs: { gained: string[]; atRisk: string[] }
  conservative: { affected_skus: string[]; timeline: string }
  aggressive: { affected_skus: string[]; timeline: string }
  evidence: EvidenceItem[]
  estimated_impact: string
  compliance_requirements: ComplianceRequirement[]
}

// ─── Agnes ────────────────────────────────────────────────────────────────────

export interface AgnesMessage {
  role: 'user' | 'assistant'
  content: string
  reasoning_steps?: string[]
  cited_evidence_indices?: number[]
}

export interface AgnesSuggestedQuestion {
  id: string
  question: string
}

export interface AgnesAskRequest {
  proposal_id: string
  message: string
  history?: AgnesMessage[]
}

export interface AgnesAskResponse {
  reply: AgnesMessage
}

// ─── Tuning (v2: deferred post-hackathon) ────────────────────────────────────
// export interface SupplierAllocation {
//   supplier_id: string
//   raw_material_id: string
//   quantity_kg: number
// }
// export interface TuningRequest { allocations: SupplierAllocation[] }
// export interface TuningResponse { allocations: SupplierAllocation[]; proposals: Proposal[] }
