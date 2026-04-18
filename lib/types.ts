// Hand-maintained domain type facade.
// TODO: once backend publishes new schemas, re-run `yarn gen:types` and swap
// each interface below to `type Foo = S['Foo']` from ./types.generated.

// ─── Core entities ────────────────────────────────────────────────────────────

export interface Company {
  id: number
  name: string
}

export interface Product {
  id: number
  sku: string
  company_id: number
}

export interface RawMaterial {
  id: number
  sku: string
}

export interface Supplier {
  id: number
  name: string
}

export interface BOM {
  id: number
  produced_product_id: number
  consumed_raw_material_ids: number[]
}

export interface SupplierRawMaterial {
  supplier_id: number
  raw_material_id: number
}

// ─── Substitutions ────────────────────────────────────────────────────────────

export interface Substitution {
  id: number
  from_raw_material_id: number
  to_raw_material_id: number
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
  id: number
  kind: ProposalKind
  headline: string
  summary: string
  raw_material_id: number
  proposed_action: string
  companies_involved: number[]
  current_suppliers: number[]
  proposed_supplier_id?: number | null
  proposed_substitute_raw_material_id?: number | null
  fragmentation_score: number
  tradeoffs: { gained: string[]; atRisk: string[] }
  conservative: { affected_skus: string[]; timeline: string }
  aggressive: { affected_skus: string[]; timeline: string }
  evidence: EvidenceItem[]
  estimated_impact: string
  compliance_requirements: ComplianceRequirement[]
}

// ─── Decisions ────────────────────────────────────────────────────────────────

export type DecisionStatus = 'accepted' | 'rejected'

export interface Decision {
  id: number
  proposal_id: number
  status: DecisionStatus
  reason?: string | null
  created_at: string
}

export interface CreateDecisionRequest {
  status: DecisionStatus
  reason?: string
}

// ─── Agnes ────────────────────────────────────────────────────────────────────

export interface AgnesMessage {
  role: 'user' | 'assistant'
  content: string
  reasoning_steps?: string[]
  cited_evidence_indices?: number[]
}

export interface AgnesSuggestedQuestion {
  id: number
  question: string
}

export interface AgnesAskRequest {
  proposal_id: number
  message: string
  session_id?: string | null
}

export interface AgnesAskResponse {
  reply: AgnesMessage
  session_id: string
}

// ─── Tuning (v2: deferred post-hackathon) ────────────────────────────────────
// export interface SupplierAllocation {
//   supplier_id: number
//   raw_material_id: number
//   quantity_kg: number
// }
// export interface TuningRequest { allocations: SupplierAllocation[] }
// export interface TuningResponse { allocations: SupplierAllocation[]; proposals: Proposal[] }
