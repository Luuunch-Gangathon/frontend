// Hand-maintained domain type facade.

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
  suppliers_count: number
  used_products_count: number
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

// ─── Tool results ─────────────────────────────────────────────────────────────

export interface SearchHit {
  raw_material_name: string
  raw_material_id?: number | null
  similarity: number
  spec?: Record<string, unknown> | null
  companies: string[]
  suppliers: string[]
}

export interface ComplianceMatch {
  raw_material_id?: number | null
  raw_material_name: string
  score: number
  reasoning: string
  similarity: number
  companies_affected: string[]
  suppliers: string[]
}

export interface ToolCall {
  name: 'search' | 'similarity_compliance_check' | 'web_search_enrich'
  arguments: Record<string, unknown>
  result: SearchHit[] | ComplianceMatch[] | string[]
}

// ─── Chat messages ────────────────────────────────────────────────────────────

export interface UserMessage {
  role: 'user'
  content: string
}

export interface AssistantMessage {
  role: 'assistant'
  content: string
  tool_calls: ToolCall[]
}

export type ChatMessage = UserMessage | AssistantMessage

// ─── Agnes ────────────────────────────────────────────────────────────────────

export interface AgnesMessage {
  role: 'user' | 'assistant'
  content: string
  reasoning_steps?: string[]
  cited_evidence_indices?: number[]
}

export interface AgnesAskRequest {
  message: string
  session_id?: string | null
  product_id?: number | null
}

export interface AgnesAskResponse {
  reply: AgnesMessage
  session_id: string
  tool_calls: ToolCall[]
}

// ─── Decisions ────────────────────────────────────────────────────────────────

export interface DecisionCreate {
  session_id: string
  status: 'accepted' | 'declined'
  original_raw_material_name: string
  substitute_raw_material_name: string
  product_sku?: string
  score: number
  reasoning: string
}

export interface Decision {
  id: number
  session_id: string
  status: string
  original_raw_material_name: string
  substitute_raw_material_name: string
  product_sku?: string | null
  score: number
  reasoning: string
}
