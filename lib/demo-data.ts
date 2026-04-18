// ─── Schema-aligned types ─────────────────────────────────────────────────────

export interface Company { id: string; name: string }

export interface Product {
  id: string
  sku: string
  company_id: string
}

export interface RawMaterial {
  id: string
  sku: string
}

export interface BOM {
  id: string
  produced_product_id: string
  consumed_raw_material_ids: string[]
}

export interface Supplier { id: string; name: string }

export interface SupplierRawMaterial { supplier_id: string; raw_material_id: string }

// ─── Frontend-only demo overlay (not in backend schema) ───────────────────────

export interface EvidenceItem { claim: string; source: string; url?: string }

export interface Opportunity {
  id: string
  kind: 'consolidate' | 'substitute'
  headline: string
  summary: string
  raw_material_id: string
  proposed_action: string
  companies_involved: string[]
  current_suppliers: string[]
  proposed_supplier_id?: string
  proposed_substitute_raw_material_id?: string
  fragmentation_score: number
  tradeoffs: { gained: string[]; atRisk: string[] }
  conservative: { affected_skus: string[]; timeline: string }
  aggressive: { affected_skus: string[]; timeline: string }
  evidence: EvidenceItem[]
  estimated_impact: string
}

// ─── Seed data ────────────────────────────────────────────────────────────────

export const COMPANIES: Company[] = [
  { id: "pharma-co", name: "PharmaCo" },
  { id: "nutri-labs", name: "NutriLabs" },
  { id: "biotech-rx", name: "BiotechRx" },
  { id: "wellness-plus", name: "WellnessPlus" },
  { id: "green-health", name: "GreenHealth" },
  { id: "vita-core", name: "VitaCore" },
  { id: "apex-pharma", name: "ApexPharma" },
  { id: "nova-nutraceuticals", name: "NovaRx" },
]

export const PRODUCTS: Product[] = [
  { id: "fg-omep-20mg-cap", sku: "FG-OMEP-20MG-CAP", company_id: "pharma-co" },
  { id: "fg-vitd-2000iu-tab", sku: "FG-VITD-2000IU-TAB", company_id: "pharma-co" },
  { id: "fg-metf-500mg-tab", sku: "FG-METF-500MG-TAB", company_id: "pharma-co" },
  { id: "fg-whey-pro-pwd", sku: "FG-WHEY-PRO-PWD", company_id: "nutri-labs" },
  { id: "fg-multi-vit-tab", sku: "FG-MULTI-VIT-TAB", company_id: "nutri-labs" },
  { id: "fg-energy-focus-cap", sku: "FG-ENERGY-FOCUS-CAP", company_id: "nutri-labs" },
  { id: "fg-prob-50b-cap", sku: "FG-PROB-50B-CAP", company_id: "biotech-rx" },
  { id: "fg-fishoil-1000mg-sgc", sku: "FG-FISHOIL-1000MG-SGC", company_id: "biotech-rx" },
  { id: "fg-sleep-supp-cap", sku: "FG-SLEEP-SUPP-CAP", company_id: "wellness-plus" },
  { id: "fg-mag-glyc-tab", sku: "FG-MAG-GLYC-TAB", company_id: "wellness-plus" },
  { id: "fg-org-omega-sgc", sku: "FG-ORG-OMEGA-SGC", company_id: "green-health" },
  { id: "fg-plant-pro-pwd", sku: "FG-PLANT-PRO-PWD", company_id: "green-health" },
  { id: "fg-bcomp-100-tab", sku: "FG-BCOMP-100-TAB", company_id: "vita-core" },
  { id: "fg-calc-d3-tab", sku: "FG-CALC-D3-TAB", company_id: "vita-core" },
  { id: "fg-immune-boost-cap", sku: "FG-IMMUNE-BOOST-CAP", company_id: "vita-core" },
  { id: "fg-ibu-200mg-tab", sku: "FG-IBU-200MG-TAB", company_id: "apex-pharma" },
  { id: "fg-allergy-rlf-tab", sku: "FG-ALLERGY-RLF-TAB", company_id: "apex-pharma" },
  { id: "fg-joint-supp-cap", sku: "FG-JOINT-SUPP-CAP", company_id: "nova-nutraceuticals" },
  { id: "fg-collagen-blend-pwd", sku: "FG-COLLAGEN-BLEND-PWD", company_id: "nova-nutraceuticals" },
]

export const RAW_MATERIALS: RawMaterial[] = [
  { id: "rm-mag-stearate", sku: "RM-MAG-STEARATE" },
  { id: "rm-soy-lecithin", sku: "RM-SOY-LECITHIN" },
  { id: "rm-sunflower-lecithin", sku: "RM-SUNFLOWER-LECITHIN" },
  { id: "rm-mcc-ph101", sku: "RM-MCC-PH101" },
  { id: "rm-vitd3-cholecalciferol", sku: "RM-VITD3-CHOLECALCIFEROL" },
  { id: "rm-fishoil-concentrate", sku: "RM-FISHOIL-CONCENTRATE" },
  { id: "rm-sunflower-oil", sku: "RM-SUNFLOWER-OIL" },
  { id: "rm-gelatin", sku: "RM-GELATIN" },
  { id: "rm-hpmc", sku: "RM-HPMC" },
  { id: "rm-corn-starch", sku: "RM-CORN-STARCH" },
]

export const BOMS: BOM[] = [
  { id: "bom-omep", produced_product_id: "fg-omep-20mg-cap", consumed_raw_material_ids: ["rm-mag-stearate", "rm-mcc-ph101", "rm-hpmc"] },
  { id: "bom-vitd", produced_product_id: "fg-vitd-2000iu-tab", consumed_raw_material_ids: ["rm-mag-stearate", "rm-vitd3-cholecalciferol", "rm-mcc-ph101", "rm-corn-starch"] },
  { id: "bom-metf", produced_product_id: "fg-metf-500mg-tab", consumed_raw_material_ids: ["rm-mag-stearate", "rm-mcc-ph101", "rm-corn-starch"] },
  { id: "bom-whey", produced_product_id: "fg-whey-pro-pwd", consumed_raw_material_ids: ["rm-soy-lecithin", "rm-sunflower-oil"] },
  { id: "bom-multi", produced_product_id: "fg-multi-vit-tab", consumed_raw_material_ids: ["rm-mag-stearate", "rm-vitd3-cholecalciferol", "rm-mcc-ph101"] },
  { id: "bom-energy", produced_product_id: "fg-energy-focus-cap", consumed_raw_material_ids: ["rm-soy-lecithin", "rm-mag-stearate"] },
  { id: "bom-prob", produced_product_id: "fg-prob-50b-cap", consumed_raw_material_ids: ["rm-mag-stearate", "rm-hpmc", "rm-mcc-ph101"] },
  { id: "bom-fishoil", produced_product_id: "fg-fishoil-1000mg-sgc", consumed_raw_material_ids: ["rm-fishoil-concentrate", "rm-gelatin", "rm-soy-lecithin"] },
  { id: "bom-sleep", produced_product_id: "fg-sleep-supp-cap", consumed_raw_material_ids: ["rm-mag-stearate", "rm-hpmc"] },
  { id: "bom-mag", produced_product_id: "fg-mag-glyc-tab", consumed_raw_material_ids: ["rm-mag-stearate", "rm-mcc-ph101", "rm-corn-starch"] },
  { id: "bom-omega", produced_product_id: "fg-org-omega-sgc", consumed_raw_material_ids: ["rm-fishoil-concentrate", "rm-sunflower-lecithin", "rm-sunflower-oil"] },
  { id: "bom-plant", produced_product_id: "fg-plant-pro-pwd", consumed_raw_material_ids: ["rm-soy-lecithin", "rm-mag-stearate"] },
  { id: "bom-bcomp", produced_product_id: "fg-bcomp-100-tab", consumed_raw_material_ids: ["rm-mag-stearate", "rm-mcc-ph101"] },
  { id: "bom-calcd3", produced_product_id: "fg-calc-d3-tab", consumed_raw_material_ids: ["rm-vitd3-cholecalciferol", "rm-mag-stearate", "rm-corn-starch"] },
  { id: "bom-immune", produced_product_id: "fg-immune-boost-cap", consumed_raw_material_ids: ["rm-mag-stearate", "rm-mcc-ph101"] },
  { id: "bom-ibu", produced_product_id: "fg-ibu-200mg-tab", consumed_raw_material_ids: ["rm-mag-stearate", "rm-mcc-ph101", "rm-corn-starch"] },
  { id: "bom-allergy", produced_product_id: "fg-allergy-rlf-tab", consumed_raw_material_ids: ["rm-mag-stearate", "rm-hpmc"] },
  { id: "bom-joint", produced_product_id: "fg-joint-supp-cap", consumed_raw_material_ids: ["rm-gelatin", "rm-vitd3-cholecalciferol", "rm-mag-stearate"] },
  { id: "bom-collagen", produced_product_id: "fg-collagen-blend-pwd", consumed_raw_material_ids: ["rm-soy-lecithin"] },
]

export const SUPPLIERS: Supplier[] = [
  { id: "jost-chemical", name: "Jost Chemical" },
  { id: "peter-greven", name: "Peter Greven" },
  { id: "mallinckrodt", name: "Mallinckrodt Pharma" },
  { id: "chemwerth", name: "Chemwerth Inc." },
  { id: "cargill", name: "Cargill" },
  { id: "adt", name: "American Lecithin (ADT)" },
  { id: "lecico", name: "LECICO GmbH" },
  { id: "dsm", name: "DSM Nutritional Products" },
  { id: "rousselot", name: "Rousselot" },
  { id: "fmc-biopolymer", name: "FMC Biopolymer" },
]

export const SUPPLIER_RAW_MATERIALS: SupplierRawMaterial[] = [
  { supplier_id: "jost-chemical", raw_material_id: "rm-mag-stearate" },
  { supplier_id: "peter-greven", raw_material_id: "rm-mag-stearate" },
  { supplier_id: "mallinckrodt", raw_material_id: "rm-mag-stearate" },
  { supplier_id: "chemwerth", raw_material_id: "rm-mag-stearate" },
  { supplier_id: "cargill", raw_material_id: "rm-soy-lecithin" },
  { supplier_id: "adt", raw_material_id: "rm-soy-lecithin" },
  { supplier_id: "lecico", raw_material_id: "rm-sunflower-lecithin" },
  { supplier_id: "fmc-biopolymer", raw_material_id: "rm-mcc-ph101" },
  { supplier_id: "fmc-biopolymer", raw_material_id: "rm-hpmc" },
  { supplier_id: "dsm", raw_material_id: "rm-vitd3-cholecalciferol" },
  { supplier_id: "dsm", raw_material_id: "rm-fishoil-concentrate" },
  { supplier_id: "cargill", raw_material_id: "rm-sunflower-oil" },
  { supplier_id: "rousselot", raw_material_id: "rm-gelatin" },
  { supplier_id: "cargill", raw_material_id: "rm-corn-starch" },
]

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-consolidate-mag-stearate",
    kind: "consolidate",
    headline: "Consolidate magnesium stearate suppliers across 8 companies",
    summary: "Four competing suppliers, one raw material, portfolio-wide leverage going unused — consolidating on Jost Chemical unlocks $210k–250k in annual savings.",
    raw_material_id: "rm-mag-stearate",
    proposed_action: "Consolidate all 8 portfolio companies onto Jost Chemical as the primary RM-MAG-STEARATE supplier, with Peter Greven qualified as backup for Halal-labelled SKUs.",
    companies_involved: ["pharma-co", "nutri-labs", "biotech-rx", "wellness-plus", "green-health", "vita-core", "apex-pharma", "nova-nutraceuticals"],
    current_suppliers: ["jost-chemical", "peter-greven", "mallinckrodt", "chemwerth"],
    proposed_supplier_id: "jost-chemical",
    fragmentation_score: 87,
    tradeoffs: {
      gained: [
        "15–18% cost reduction (~$240k/yr across portfolio)",
        "Single audit cycle replaces 4 annual supplier audits, saving ~$54k/yr",
        "Unified CoA format reduces QA processing time by ~60%",
        "Volume tier unlocks Jost's dedicated batch allocation",
      ],
      atRisk: [
        "Single-source concentration risk without secondary qualification",
        "Peter Greven's Halal cert not matched by Jost (affects 2 WellnessPlus SKUs)",
        "Mallinckrodt's FDA-registered facility adds regulatory comfort for ApexPharma",
      ],
    },
    conservative: {
      affected_skus: ["FG-OMEP-20MG-CAP", "FG-VITD-2000IU-TAB", "FG-METF-500MG-TAB", "FG-MULTI-VIT-TAB", "FG-ENERGY-FOCUS-CAP", "FG-PROB-50B-CAP", "FG-SLEEP-SUPP-CAP", "FG-MAG-GLYC-TAB"],
      timeline: "9–12 months phased — PharmaCo and NutriLabs first (Q1), remaining 6 companies in Q2–Q3. Peter Greven retained as Halal backup.",
    },
    aggressive: {
      affected_skus: ["FG-OMEP-20MG-CAP", "FG-VITD-2000IU-TAB", "FG-METF-500MG-TAB", "FG-MULTI-VIT-TAB", "FG-ENERGY-FOCUS-CAP", "FG-PROB-50B-CAP", "FG-SLEEP-SUPP-CAP", "FG-MAG-GLYC-TAB", "FG-PLANT-PRO-PWD", "FG-BCOMP-100-TAB", "FG-CALC-D3-TAB", "FG-IMMUNE-BOOST-CAP", "FG-IBU-200MG-TAB", "FG-ALLERGY-RLF-TAB", "FG-JOINT-SUPP-CAP"],
      timeline: "3–4 months full cutover — all 8 companies simultaneously, bridge stock from Jost pre-ordered in month 1.",
    },
    evidence: [
      {
        claim: "Jost Chemical holds USP, GMP, Kosher, and ISO 9001 certifications — covering all portfolio compliance requirements except Halal.",
        source: "Jost Chemical supplier qualification dossier, rev. 2024",
      },
      {
        claim: "Portfolio spend on RM-MAG-STEARATE across 8 companies is estimated at ~$1.4M/yr; a 15–18% volume discount yields $210–252k in annual savings.",
        source: "Spherecast procurement analysis, Q4 2024",
      },
      {
        claim: "Consolidating to a single supplier reduces annual audit burden from 4 audits (avg. $18k each) to 1, saving ~$54k/yr in audit costs.",
        source: "Internal Spherecast audit cost model",
      },
      {
        claim: "Peter Greven's Halal certification is not currently matched by Jost Chemical; WellnessPlus has 2 Halal-labelled SKUs requiring supplier variance or reformulation.",
        source: "WellnessPlus compliance team, Jan 2025",
      },
      {
        claim: "Magnesium stearate supply disruptions are rare (<0.5% annual incidence for top-tier suppliers) but portfolio-wide single-source exposure would affect all 15 SKUs simultaneously.",
        source: "PharmaTech Supply Risk Report 2024",
      },
    ],
    estimated_impact: "$210k–250k/yr savings",
  },
  {
    id: "opp-substitute-soy-lecithin",
    kind: "substitute",
    headline: "Substitute soy lecithin with sunflower lecithin across 5 SKUs",
    summary: "Functionally equivalent swap eliminates the soy allergen declaration, unlocking allergen-restricted retail channels worth an estimated $1.2M in new revenue.",
    raw_material_id: "rm-soy-lecithin",
    proposed_action: "Replace RM-SOY-LECITHIN with RM-SUNFLOWER-LECITHIN (sourced from LECICO GmbH) across 5 finished-good SKUs. Use rate increases 5–10% to match emulsification capacity.",
    companies_involved: ["nutri-labs", "biotech-rx", "green-health", "nova-nutraceuticals"],
    current_suppliers: ["cargill", "adt"],
    proposed_substitute_raw_material_id: "rm-sunflower-lecithin",
    fragmentation_score: 62,
    tradeoffs: {
      gained: [
        "Eliminates soy allergen declaration on all 5 switched SKUs",
        "Non-GMO certification auto-upgraded on all switched SKUs",
        "Opens access to allergen-restricted retail chains (4 new channels identified)",
        "LECICO GmbH is Organic certified — further label upgrade at no extra cost",
      ],
      atRisk: [
        "5–10% higher use rate of sunflower lecithin required vs. soy",
        "LECICO GmbH is sole qualified source for RM-SUNFLOWER-LECITHIN (single-source risk)",
        "BiotechRx fish oil softgel requires additional dissolution validation",
      ],
    },
    conservative: {
      affected_skus: ["FG-WHEY-PRO-PWD", "FG-PLANT-PRO-PWD"],
      timeline: "6–8 months pilot — start with FG-WHEY-PRO-PWD and FG-PLANT-PRO-PWD (lowest regulatory complexity); validate dissolution and shelf-life before expanding.",
    },
    aggressive: {
      affected_skus: ["FG-WHEY-PRO-PWD", "FG-ENERGY-FOCUS-CAP", "FG-FISHOIL-1000MG-SGC", "FG-PLANT-PRO-PWD", "FG-COLLAGEN-BLEND-PWD"],
      timeline: "3–4 months full portfolio switch — parallel reformulation at all 4 companies; LECICO pre-qualifies all sites in month 1.",
    },
    evidence: [
      {
        claim: "Sunflower lecithin and soy lecithin share identical HLB range (7–9), ensuring functional equivalence as emulsifiers in aqueous-lipid systems.",
        source: "LECICO GmbH technical bulletin SL-2023-04",
      },
      {
        claim: "A 5–10% higher use rate of sunflower lecithin is sufficient to match soy lecithin's emulsification performance — confirmed in 3 internal formulation trials.",
        source: "NutriLabs formulation development report, Oct 2024",
      },
      {
        claim: "Elimination of the soy allergen declaration opens 4 new retail chains (Whole Foods 365, Trader Joe's, Target Clean, Kroger SimpleNutrition) that restrict soy-containing supplements.",
        source: "Spherecast retail channel analysis, Nov 2024",
      },
      {
        claim: "Sunflower lecithin from LECICO GmbH is Non-GMO Project Verified and Organic certified — upgrades all switched SKUs without additional cost.",
        source: "LECICO GmbH certification pack, 2024",
      },
      {
        claim: "Regulatory precedent: sunflower lecithin as a direct replacement for soy lecithin accepted by FDA (GRAS), EFSA (E476 equivalent), and Health Canada.",
        source: "FDA GRAS Notice GRN 000712; EFSA Journal 2019",
      },
    ],
    estimated_impact: "$1.2M new revenue via allergen-free channels",
  },
  {
    id: "opp-consolidate-mcc-ph101",
    kind: "consolidate",
    headline: "Formalize MCC PH101 portfolio agreement with FMC Biopolymer",
    summary: "Six companies already buy from a single supplier — formalizing this as a portfolio MSA captures 12% additional discount and replaces 6 individual contracts with one.",
    raw_material_id: "rm-mcc-ph101",
    proposed_action: "Execute a portfolio-level Master Supply Agreement with FMC Biopolymer covering all 6 companies consuming RM-MCC-PH101, while qualifying Ashland as a secondary source to eliminate single-supplier concentration risk.",
    companies_involved: ["pharma-co", "nutri-labs", "biotech-rx", "wellness-plus", "vita-core", "apex-pharma"],
    current_suppliers: ["fmc-biopolymer"],
    proposed_supplier_id: "fmc-biopolymer",
    fragmentation_score: 44,
    tradeoffs: {
      gained: [
        "12% further discount via portfolio-level volume agreement",
        "FMC's dedicated technical service team for all 6 companies",
        "Single master supplier agreement replaces 6 individual contracts",
        "Ashland qualification as backup eliminates single-source risk",
      ],
      atRisk: [
        "Portfolio-wide supply exposure during negotiation window if FMC knows there is no backup",
        "Ashland qualification adds 10–14 weeks and ~$40k in validation costs",
      ],
    },
    conservative: {
      affected_skus: ["FG-OMEP-20MG-CAP", "FG-VITD-2000IU-TAB", "FG-METF-500MG-TAB", "FG-MULTI-VIT-TAB", "FG-PROB-50B-CAP", "FG-MAG-GLYC-TAB"],
      timeline: "4–6 months — formalize portfolio MSA with FMC, begin Ashland qualification in parallel as backup.",
    },
    aggressive: {
      affected_skus: ["FG-OMEP-20MG-CAP", "FG-VITD-2000IU-TAB", "FG-METF-500MG-TAB", "FG-MULTI-VIT-TAB", "FG-PROB-50B-CAP", "FG-MAG-GLYC-TAB", "FG-BCOMP-100-TAB", "FG-IMMUNE-BOOST-CAP", "FG-IBU-200MG-TAB"],
      timeline: "2–3 months — execute portfolio MSA immediately, all 6 companies co-sign in Q1. Back-qualify Ashland within 6 months.",
    },
    evidence: [
      {
        claim: "FMC Biopolymer holds USP, GMP, Non-GMO, and ISO 9001 certifications — covering all portfolio compliance requirements for excipient-grade MCC.",
        source: "FMC Biopolymer supplier qualification dossier, rev. 2024",
      },
      {
        claim: "Combined RM-MCC-PH101 volume across 6 companies is estimated at 8.2 metric tons/yr; a portfolio MSA qualifies for FMC's Tier 2 pricing, delivering 12% unit cost reduction.",
        source: "Spherecast procurement analysis, Q4 2024",
      },
      {
        claim: "RM-MCC-PH101 is already qualified at all 6 manufacturing sites — no re-qualification required, making the switch to a portfolio agreement administratively frictionless.",
        source: "Spherecast supplier qualification register, Q4 2024",
      },
      {
        claim: "Replacing 6 individual supplier contracts with a single master agreement reduces annual legal/procurement overhead by an estimated $28k/yr.",
        source: "Internal Spherecast contract management analysis",
      },
    ],
    estimated_impact: "$85k–110k/yr via portfolio MSA",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id)
}

export function getSupplier(id: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.id === id)
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getRawMaterial(id: string): RawMaterial | undefined {
  return RAW_MATERIALS.find((r) => r.id === id)
}

export function getFinishedGoodsForCompany(companyId: string): Product[] {
  return PRODUCTS.filter((p) => p.company_id === companyId)
}

export function getBOM(productId: string): BOM | undefined {
  return BOMS.find((b) => b.produced_product_id === productId)
}

export function getRawMaterialsForProduct(productId: string): RawMaterial[] {
  const bom = getBOM(productId)
  if (!bom) return []
  return bom.consumed_raw_material_ids
    .map((id) => getRawMaterial(id))
    .filter((r): r is RawMaterial => r != null)
}

export function getSuppliersForRawMaterial(rawMaterialId: string): Supplier[] {
  return SUPPLIER_RAW_MATERIALS
    .filter((srm) => srm.raw_material_id === rawMaterialId)
    .map((srm) => getSupplier(srm.supplier_id))
    .filter((s): s is Supplier => s != null)
}

export function getFinishedGoodsUsingRawMaterial(rawMaterialId: string): Product[] {
  const productIds = new Set(
    BOMS
      .filter((b) => b.consumed_raw_material_ids.includes(rawMaterialId))
      .map((b) => b.produced_product_id)
  )
  return PRODUCTS.filter((p) => productIds.has(p.id))
}

export function getCompaniesUsingRawMaterial(rawMaterialId: string): Company[] {
  const companyIds = new Set(
    getFinishedGoodsUsingRawMaterial(rawMaterialId).map((p) => p.company_id)
  )
  return COMPANIES.filter((c) => companyIds.has(c.id))
}

export function getOpportunities(): Opportunity[] {
  return [...OPPORTUNITIES].sort((a, b) => b.fragmentation_score - a.fragmentation_score)
}

export function getOpportunity(id: string): Opportunity | undefined {
  return OPPORTUNITIES.find((o) => o.id === id)
}

export function getPortfolioStats() {
  const allRawMaterialIds = new Set(BOMS.flatMap((b) => b.consumed_raw_material_ids))
  const allSupplierIds = new Set(
    SUPPLIER_RAW_MATERIALS
      .filter((srm) => allRawMaterialIds.has(srm.raw_material_id))
      .map((srm) => srm.supplier_id)
  )
  return {
    companies: COMPANIES.length,
    products: PRODUCTS.length,
    suppliers: allSupplierIds.size,
    opportunities: OPPORTUNITIES.length,
  }
}
