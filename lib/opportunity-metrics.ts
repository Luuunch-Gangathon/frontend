import {
  OPPORTUNITIES,
  BOMS,
  RAW_MATERIALS,
  SUPPLIER_RAW_MATERIALS,
  COMPANIES,
  PRODUCTS,
  SUPPLIERS,
  type Opportunity,
} from "./demo-data"

export function parseSavingsUsd(impact: string): number {
  const mMatch = impact.match(/\$([\d.]+)M/)
  if (mMatch) return parseFloat(mMatch[1]) * 1_000_000
  const kRange = impact.match(/\$(\d+)k[–\-](\d+)k/)
  if (kRange) return ((parseInt(kRange[1]) + parseInt(kRange[2])) / 2) * 1_000
  const kSingle = impact.match(/\$([\d.]+)k/)
  if (kSingle) return parseFloat(kSingle[1]) * 1_000
  return 0
}

export function parseTimelineWeeks(timeline: string): number {
  const mRange = timeline.match(/(\d+)[–\-](\d+)\s*month/)
  if (mRange) {
    return Math.round(((parseInt(mRange[1]) + parseInt(mRange[2])) / 2) * 4.33)
  }
  const mSingle = timeline.match(/(\d+(?:\.\d+)?)\s*month/)
  if (mSingle) return Math.round(parseFloat(mSingle[1]) * 4.33)
  return 16
}

// Score = fragmentation_score × companies_involved / timeline_weeks
export function rankingScore(opp: Opportunity): number {
  const weeks = parseTimelineWeeks(opp.conservative.timeline)
  if (weeks === 0) return 0
  return (opp.fragmentation_score * opp.companies_involved.length) / weeks
}

export function getRankedOpportunities() {
  return [...OPPORTUNITIES]
    .map((opp) => ({
      opp,
      score: rankingScore(opp),
      savingsUsd: parseSavingsUsd(opp.estimated_impact),
      timelineWeeks: parseTimelineWeeks(opp.conservative.timeline),
    }))
    .sort((a, b) => b.score - a.score)
}

export function sharedCompanies(a: Opportunity, b: Opportunity): string[] {
  return a.companies_involved.filter((id) => b.companies_involved.includes(id))
}

export function sharedSkus(a: Opportunity, b: Opportunity): string[] {
  const aSkus = new Set([...a.conservative.affected_skus, ...a.aggressive.affected_skus])
  const bSkus = new Set([...b.conservative.affected_skus, ...b.aggressive.affected_skus])
  return [...aSkus].filter((sku) => bSkus.has(sku))
}

export function getRmSupplierCounts() {
  return RAW_MATERIALS.map((rm) => ({
    rmId: rm.id,
    label: rm.sku.replace("RM-", "").replace(/-/g, " "),
    supplierCount: SUPPLIER_RAW_MATERIALS.filter((srm) => srm.raw_material_id === rm.id).length,
  }))
    .filter((d) => d.supplierCount > 0)
    .sort((a, b) => b.supplierCount - a.supplierCount)
}

function getCompanyRawMaterials(companyId: string): Set<string> {
  const companyProducts = PRODUCTS.filter((p) => p.company_id === companyId)
  const rmIds = new Set<string>()
  companyProducts.forEach((product) => {
    const bom = BOMS.find((b) => b.produced_product_id === product.id)
    if (bom) bom.consumed_raw_material_ids.forEach((id) => rmIds.add(id))
  })
  return rmIds
}

export function getCompanyOverlapMatrix() {
  const rows = COMPANIES.map((c) => ({
    company: c,
    rms: getCompanyRawMaterials(c.id),
  }))
  const matrix = rows.map((row) =>
    rows.map((col) => {
      if (row.company.id === col.company.id) return -1 // diagonal
      return [...row.rms].filter((rm) => col.rms.has(rm)).length
    })
  )
  return { companies: COMPANIES, matrix }
}

export function getScatterData() {
  return OPPORTUNITIES.map((opp) => ({
    id: opp.id,
    label: opp.headline.split(" ").slice(0, 3).join(" "),
    x: parseTimelineWeeks(opp.conservative.timeline),
    y: parseSavingsUsd(opp.estimated_impact),
    z: opp.companies_involved.length,
    kind: opp.kind,
  }))
}

export function getSupplierConcentration() {
  const supplierBomCounts = new Map<string, number>()
  SUPPLIER_RAW_MATERIALS.forEach(({ supplier_id, raw_material_id }) => {
    const bomCount = BOMS.filter((b) =>
      b.consumed_raw_material_ids.includes(raw_material_id)
    ).length
    supplierBomCounts.set(supplier_id, (supplierBomCounts.get(supplier_id) ?? 0) + bomCount)
  })
  return Array.from(supplierBomCounts.entries())
    .map(([supplierId, value]) => ({
      name: SUPPLIERS.find((s) => s.id === supplierId)?.name ?? supplierId,
      value,
    }))
    .sort((a, b) => b.value - a.value)
}

// Plan cart aggregators
export function getPlanSummary(oppIds: string[]) {
  const opps = oppIds
    .map((id) => OPPORTUNITIES.find((o) => o.id === id))
    .filter((o): o is Opportunity => o != null)

  const totalSavings = opps.reduce((sum, o) => sum + parseSavingsUsd(o.estimated_impact), 0)
  const allCompanies = new Set(opps.flatMap((o) => o.companies_involved))
  const allSkus = new Set(opps.flatMap((o) => [...o.conservative.affected_skus, ...o.aggressive.affected_skus]))
  const maxTimeline = Math.max(...opps.map((o) => parseTimelineWeeks(o.conservative.timeline)), 0)

  // Find SKU conflicts: same SKU in 2+ opportunities with different rollout plans
  const skuToOpps = new Map<string, string[]>()
  opps.forEach((opp) => {
    const allOppSkus = [...new Set([...opp.conservative.affected_skus, ...opp.aggressive.affected_skus])]
    allOppSkus.forEach((sku) => {
      if (!skuToOpps.has(sku)) skuToOpps.set(sku, [])
      skuToOpps.get(sku)!.push(opp.id)
    })
  })
  const conflicts = [...skuToOpps.entries()]
    .filter(([, oppIds]) => oppIds.length > 1)
    .map(([sku, oppIds]) => ({ sku, oppIds }))

  return {
    opps,
    totalSavings,
    companiesCount: allCompanies.size,
    skusCount: allSkus.size,
    maxTimelineWeeks: maxTimeline,
    conflicts,
  }
}
