import type { ChatMessage, SearchHit, ComplianceMatch } from './types'

export interface AggregatedMaterial {
  name: string
  id?: number | null
  bestSimilarity?: number
  bestScore?: number
  companies: string[]
  suppliers: string[]
  isSubstitutionCandidate: boolean
  firstSeenAtMsgIndex: number
}

export interface AggregatedEntities {
  materials: AggregatedMaterial[]
  companies: { name: string; materialCount: number }[]
  suppliers: { name: string; materialCount: number }[]
}

export function aggregateEntities(messages: ChatMessage[]): AggregatedEntities {
  const materialMap = new Map<string, AggregatedMaterial>()

  messages.forEach((msg, msgIndex) => {
    if (msg.role !== 'assistant') return

    for (const tc of msg.tool_calls) {
      if (tc.name === 'search') {
        for (const hit of tc.result as SearchHit[]) {
          const key = hit.raw_material_name
          const existing = materialMap.get(key)
          if (existing) {
            existing.bestSimilarity = Math.max(existing.bestSimilarity ?? 0, hit.similarity)
            for (const c of hit.companies) {
              if (!existing.companies.includes(c)) existing.companies.push(c)
            }
            for (const s of hit.suppliers) {
              if (!existing.suppliers.includes(s)) existing.suppliers.push(s)
            }
          } else {
            materialMap.set(key, {
              name: hit.raw_material_name,
              id: hit.raw_material_id,
              bestSimilarity: hit.similarity,
              companies: [...hit.companies],
              suppliers: [...hit.suppliers],
              isSubstitutionCandidate: false,
              firstSeenAtMsgIndex: msgIndex,
            })
          }
        }
      } else if (tc.name === 'similarity_compliance_check') {
        for (const match of tc.result as ComplianceMatch[]) {
          const key = match.raw_material_name
          const existing = materialMap.get(key)
          if (existing) {
            existing.bestScore = Math.max(existing.bestScore ?? 0, match.score)
            existing.isSubstitutionCandidate = true
            for (const c of match.companies_affected) {
              if (!existing.companies.includes(c)) existing.companies.push(c)
            }
            for (const s of match.suppliers) {
              if (!existing.suppliers.includes(s)) existing.suppliers.push(s)
            }
          } else {
            materialMap.set(key, {
              name: match.raw_material_name,
              id: match.raw_material_id,
              bestScore: match.score,
              companies: [...match.companies_affected],
              suppliers: [...match.suppliers],
              isSubstitutionCandidate: true,
              firstSeenAtMsgIndex: msgIndex,
            })
          }
        }
      }
    }
  })

  const materials = Array.from(materialMap.values()).sort((a, b) => {
    if (a.isSubstitutionCandidate !== b.isSubstitutionCandidate) {
      return a.isSubstitutionCandidate ? -1 : 1
    }
    if (a.isSubstitutionCandidate && b.isSubstitutionCandidate) {
      return (b.bestScore ?? 0) - (a.bestScore ?? 0)
    }
    return b.firstSeenAtMsgIndex - a.firstSeenAtMsgIndex
  })

  const companyCount = new Map<string, number>()
  const supplierCount = new Map<string, number>()

  for (const m of materials) {
    for (const c of m.companies) companyCount.set(c, (companyCount.get(c) ?? 0) + 1)
    for (const s of m.suppliers) supplierCount.set(s, (supplierCount.get(s) ?? 0) + 1)
  }

  const companies = Array.from(companyCount.entries())
    .map(([name, materialCount]) => ({ name, materialCount }))
    .sort((a, b) => b.materialCount - a.materialCount)

  const suppliers = Array.from(supplierCount.entries())
    .map(([name, materialCount]) => ({ name, materialCount }))
    .sort((a, b) => b.materialCount - a.materialCount)

  return { materials, companies, suppliers }
}
