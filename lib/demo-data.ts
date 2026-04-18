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

export interface Substitution {
  id: string
  from_raw_material_id: string
  to_raw_material_id: string
  reason: string
}

// v2: deferred — tuning disabled for hackathon demo
// export interface SupplierAllocation {
//   supplier_id: string
//   raw_material_id: string
//   quantity_kg: number
// }

// ─── Frontend-only demo overlay (not in backend schema) ───────────────────────

export interface EvidenceItem {
  claim: string
  source: string
  url?: string
  confidence?: 'high' | 'medium' | 'low'
  source_type?: 'internal' | 'supplier' | 'regulator' | 'industry'
}

export interface ComplianceRequirement {
  label: string
  status: 'met' | 'gap' | 'partial'
  note?: string | null
}

export type ProposalKind = 'optimization' | 'substitution'

export interface Proposal {
  id: string
  kind: ProposalKind
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
  compliance_requirements: ComplianceRequirement[]
}

interface AgnesCannedEntry {
  keywords: string[]
  reply: {
    role: 'assistant'
    content: string
    reasoning_steps: string[]
    cited_evidence_indices: number[]
  }
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

export const SUBSTITUTIONS: Substitution[] = [
  {
    id: "sub-soy-to-sunflower-lecithin",
    from_raw_material_id: "rm-soy-lecithin",
    to_raw_material_id: "rm-sunflower-lecithin",
    reason: "Eliminates soy allergen declaration; functionally equivalent HLB range 7–9.",
  },
  {
    id: "sub-gelatin-to-hpmc",
    from_raw_material_id: "rm-gelatin",
    to_raw_material_id: "rm-hpmc",
    reason: "Vegan/vegetarian capsule option; HPMC accepted across all major pharmacopoeias.",
  },
  {
    id: "sub-hpmc-to-gelatin",
    from_raw_material_id: "rm-hpmc",
    to_raw_material_id: "rm-gelatin",
    reason: "Cost reduction (~18%) when Halal/vegan label is not required.",
  },
  {
    id: "sub-corn-starch-to-mcc",
    from_raw_material_id: "rm-corn-starch",
    to_raw_material_id: "rm-mcc-ph101",
    reason: "MCC PH101 offers superior compressibility for direct-compression tablet lines.",
  },
]

// v2: deferred — tuning disabled for hackathon demo
// export const SUPPLIER_ALLOCATIONS: SupplierAllocation[] = [
//   { supplier_id: "jost-chemical", raw_material_id: "rm-mag-stearate", quantity_kg: 4200 },
//   { supplier_id: "peter-greven", raw_material_id: "rm-mag-stearate", quantity_kg: 1800 },
//   { supplier_id: "mallinckrodt", raw_material_id: "rm-mag-stearate", quantity_kg: 1200 },
//   { supplier_id: "chemwerth", raw_material_id: "rm-mag-stearate", quantity_kg: 800 },
//   { supplier_id: "cargill", raw_material_id: "rm-soy-lecithin", quantity_kg: 3500 },
//   { supplier_id: "adt", raw_material_id: "rm-soy-lecithin", quantity_kg: 1500 },
//   { supplier_id: "lecico", raw_material_id: "rm-sunflower-lecithin", quantity_kg: 900 },
//   { supplier_id: "fmc-biopolymer", raw_material_id: "rm-mcc-ph101", quantity_kg: 8200 },
//   { supplier_id: "fmc-biopolymer", raw_material_id: "rm-hpmc", quantity_kg: 2100 },
//   { supplier_id: "dsm", raw_material_id: "rm-vitd3-cholecalciferol", quantity_kg: 500 },
//   { supplier_id: "dsm", raw_material_id: "rm-fishoil-concentrate", quantity_kg: 6400 },
//   { supplier_id: "cargill", raw_material_id: "rm-sunflower-oil", quantity_kg: 3200 },
//   { supplier_id: "rousselot", raw_material_id: "rm-gelatin", quantity_kg: 4700 },
//   { supplier_id: "cargill", raw_material_id: "rm-corn-starch", quantity_kg: 5500 },
// ]

export const PROPOSALS: Proposal[] = [
  {
    id: "opp-consolidate-mag-stearate",
    kind: "optimization",
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
        confidence: "high",
        source_type: "supplier",
      },
      {
        claim: "Portfolio spend on RM-MAG-STEARATE across 8 companies is estimated at ~$1.4M/yr; a 15–18% volume discount yields $210–252k in annual savings.",
        source: "Spherecast procurement analysis, Q4 2024",
        confidence: "high",
        source_type: "internal",
      },
      {
        claim: "Consolidating to a single supplier reduces annual audit burden from 4 audits (avg. $18k each) to 1, saving ~$54k/yr in audit costs.",
        source: "Internal Spherecast audit cost model",
        confidence: "medium",
        source_type: "internal",
      },
      {
        claim: "Peter Greven's Halal certification is not currently matched by Jost Chemical; WellnessPlus has 2 Halal-labelled SKUs requiring supplier variance or reformulation.",
        source: "WellnessPlus compliance team, Jan 2025",
        confidence: "high",
        source_type: "internal",
      },
      {
        claim: "Magnesium stearate supply disruptions are rare (<0.5% annual incidence for top-tier suppliers) but portfolio-wide single-source exposure would affect all 15 SKUs simultaneously.",
        source: "PharmaTech Supply Risk Report 2024",
        confidence: "medium",
        source_type: "industry",
      },
    ],
    estimated_impact: "$210k–250k/yr savings",
    compliance_requirements: [
      { label: "USP",       status: "met" },
      { label: "GMP",       status: "met" },
      { label: "Kosher",    status: "met" },
      { label: "ISO 9001",  status: "met" },
      { label: "Halal",     status: "gap",     note: "Jost Chemical lacks Halal cert; affects 2 WellnessPlus SKUs" },
      { label: "FDA-registered facility", status: "partial", note: "Mallinckrodt only — not carried over to Jost" },
    ],
  },
  {
    id: "opp-substitute-soy-lecithin",
    kind: "substitution",
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
        confidence: "high",
        source_type: "supplier",
      },
      {
        claim: "A 5–10% higher use rate of sunflower lecithin is sufficient to match soy lecithin's emulsification performance — confirmed in 3 internal formulation trials.",
        source: "NutriLabs formulation development report, Oct 2024",
        confidence: "high",
        source_type: "internal",
      },
      {
        claim: "Elimination of the soy allergen declaration opens 4 new retail chains (Whole Foods 365, Trader Joe's, Target Clean, Kroger SimpleNutrition) that restrict soy-containing supplements.",
        source: "Spherecast retail channel analysis, Nov 2024",
        confidence: "medium",
        source_type: "internal",
      },
      {
        claim: "Sunflower lecithin from LECICO GmbH is Non-GMO Project Verified and Organic certified — upgrades all switched SKUs without additional cost.",
        source: "LECICO GmbH certification pack, 2024",
        confidence: "high",
        source_type: "supplier",
      },
      {
        claim: "Regulatory precedent: sunflower lecithin as a direct replacement for soy lecithin accepted by FDA (GRAS), EFSA (E476 equivalent), and Health Canada.",
        source: "FDA GRAS Notice GRN 000712; EFSA Journal 2019",
        confidence: "high",
        source_type: "regulator",
      },
    ],
    estimated_impact: "$1.2M new revenue via allergen-free channels",
    compliance_requirements: [
      { label: "Soy-allergen-free", status: "met" },
      { label: "Non-GMO",          status: "met" },
      { label: "Organic",          status: "met" },
      { label: "FDA GRAS",         status: "met" },
      { label: "EFSA approved",    status: "met" },
      { label: "Halal",            status: "met" },
      { label: "Single-source risk", status: "gap", note: "LECICO GmbH is sole qualified sunflower lecithin source" },
    ],
  },
  {
    id: "opp-consolidate-mcc-ph101",
    kind: "optimization",
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
        confidence: "high",
        source_type: "supplier",
      },
      {
        claim: "Combined RM-MCC-PH101 volume across 6 companies is estimated at 8.2 metric tons/yr; a portfolio MSA qualifies for FMC's Tier 2 pricing, delivering 12% unit cost reduction.",
        source: "Spherecast procurement analysis, Q4 2024",
        confidence: "high",
        source_type: "internal",
      },
      {
        claim: "RM-MCC-PH101 is already qualified at all 6 manufacturing sites — no re-qualification required, making the switch to a portfolio agreement administratively frictionless.",
        source: "Spherecast supplier qualification register, Q4 2024",
        confidence: "high",
        source_type: "internal",
      },
      {
        claim: "Replacing 6 individual supplier contracts with a single master agreement reduces annual legal/procurement overhead by an estimated $28k/yr.",
        source: "Internal Spherecast contract management analysis",
        confidence: "medium",
        source_type: "internal",
      },
    ],
    estimated_impact: "$85k–110k/yr via portfolio MSA",
    compliance_requirements: [
      { label: "USP",              status: "met" },
      { label: "GMP",              status: "met" },
      { label: "Non-GMO",          status: "met" },
      { label: "ISO 9001",         status: "met" },
      { label: "Secondary source", status: "gap", note: "Ashland not yet qualified — full single-source exposure during negotiation" },
    ],
  },
]

// ─── Agnes Q&A ───────────────────────────────────────────────────────────────

export const AGNES_SUGGESTED_QUESTIONS: Record<string, Array<{ id: string; question: string }>> = {
  'opp-consolidate-mag-stearate': [
    { id: 'q1', question: 'Why Jost Chemical specifically?' },
    { id: 'q2', question: 'What about Halal compliance?' },
    { id: 'q3', question: "What's the single-source risk?" },
    { id: 'q4', question: 'Is 9–12 months realistic?' },
  ],
  'opp-substitute-soy-lecithin': [
    { id: 'q1', question: 'Is sunflower lecithin really equivalent?' },
    { id: 'q2', question: 'Why LECICO as sole source?' },
    { id: 'q3', question: 'Which SKUs are affected first?' },
    { id: 'q4', question: "What's the revenue upside math?" },
  ],
  'opp-consolidate-mcc-ph101': [
    { id: 'q1', question: 'Why formalize if FMC is already the sole supplier?' },
    { id: 'q2', question: 'How long does Ashland qualification take?' },
    { id: 'q3', question: "What's the 12% discount based on?" },
    { id: 'q4', question: 'Risks during MSA negotiation?' },
  ],
}

export const AGNES_CANNED_RESPONSES: Record<string, AgnesCannedEntry[]> = {
  'opp-consolidate-mag-stearate': [
    {
      keywords: ['jost', 'why jost', 'specifically'],
      reply: {
        role: 'assistant',
        content: "Jost Chemical ranks first across four criteria: compliance coverage, cost position, capacity, and audit simplicity. They hold USP, GMP, Kosher, and ISO 9001 — matching every portfolio requirement except Halal. At our combined ~$1.4M/yr spend, Jost qualifies for a 15–18% volume discount no other supplier in this RFQ can match. Peter Greven is retained as Halal backup for WellnessPlus, so Jost as primary closes 90% of the portfolio today.",
        reasoning_steps: [
          "Screened all 4 current suppliers against portfolio compliance matrix (USP/GMP/Kosher/ISO 9001/Halal).",
          "Jost scores highest on 4 of 5 criteria; only gap is Halal for 2 WellnessPlus SKUs.",
          "Volume pricing model at $1.4M consolidated spend maps to Jost's Tier 1 bracket (15–18% off).",
          "Audit cost model confirms single-supplier cycle saves $54k/yr vs. current 4-audit burden.",
          "Peter Greven retained as Halal-qualified backup to mitigate WellnessPlus risk.",
        ],
        cited_evidence_indices: [0, 1, 2],
      },
    },
    {
      keywords: ['halal', 'halal compliance', 'wellnessplus'],
      reply: {
        role: 'assistant',
        content: "This is the one real gap in the consolidation plan. Peter Greven holds Halal certification; Jost does not. WellnessPlus has 2 Halal-labelled SKUs — FG-SLEEP-SUPP-CAP and FG-MAG-GLYC-TAB — that can't switch to Jost without losing the label. The proposed resolution: retain Peter Greven as a secondary source specifically for those 2 SKUs. Consolidation is 13 of 15 SKUs onto Jost, not all 15.",
        reasoning_steps: [
          "Identified WellnessPlus as the only portfolio company with Halal-labelled SKUs.",
          "Confirmed Jost's qualification dossier has no Halal certificate.",
          "Cross-referenced with WellnessPlus compliance team's Jan 2025 update.",
          "Peter Greven's Halal cert is current and covers the required MgSt grade.",
          "Proposed dual-supplier exception: Jost (primary, 13 SKUs) + Peter Greven (Halal SKUs only).",
        ],
        cited_evidence_indices: [0, 3],
      },
    },
    {
      keywords: ['single', 'single-source', 'concentration risk', 'risk', 'disruption'],
      reply: {
        role: 'assistant',
        content: "With all 15 SKUs on Jost, a supply disruption would hit the entire portfolio simultaneously. Historical data puts top-tier supplier disruptions at <0.5% annual incidence — statistically unlikely, but the blast radius is high. Mitigation: qualify Peter Greven as a full secondary source, maintain 60–90 days of bridge stock, and include force-majeure allocation triggers in the Jost MSA.",
        reasoning_steps: [
          "Calculated maximum exposure: 15 SKUs, all companies, full production halt if Jost disrupted.",
          "Industry data: <0.5% annual disruption rate for Tier 1 mag stearate suppliers.",
          "Compared to current state: 4 suppliers reduces blast radius but increases audit cost and price fragmentation.",
          "Proposed mitigation: Peter Greven as real secondary + 60–90 day buffer stock + contractual allocation trigger.",
        ],
        cited_evidence_indices: [4],
      },
    },
    {
      keywords: ['9', '12 months', 'timeline', 'realistic', 'months', 'phased'],
      reply: {
        role: 'assistant',
        content: "Yes — and it's the safer of the two options. The phased approach lets PharmaCo and NutriLabs validate Jost's CoA format in Q1 before the remaining 6 companies switch. The risk of the aggressive 3–4 month path: all 8 companies run change-control processes in parallel, competing for Jost's qualification support bandwidth. Phased is the right call unless the savings target is time-critical.",
        reasoning_steps: [
          "Reviewed regulatory change-control timelines for each portfolio company.",
          "PharmaCo and NutriLabs have established Jost qualification — fastest to switch.",
          "Remaining 6 companies need new CoA acceptance and possibly analytical method update.",
          "Concurrent validation across all 8 creates a Jost support bottleneck.",
          "Conservative 9–12 month phasing eliminates bottleneck at acceptable delay cost.",
        ],
        cited_evidence_indices: [1, 2],
      },
    },
  ],

  'opp-substitute-soy-lecithin': [
    {
      keywords: ['equivalent', 'really equivalent', 'same', 'functionally', 'sunflower lecithin'],
      reply: {
        role: 'assistant',
        content: "Functionally yes — with one caveat. Both sit in the HLB 7–9 range, meaning identical emulsification performance in aqueous-lipid systems. The practical difference is a 5–10% higher use rate for sunflower: you need slightly more to hit the same result. Three formulation trials at NutriLabs confirmed this. Exception: BiotechRx's fish oil softgel (FG-FISHOIL-1000MG-SGC) requires additional dissolution validation due to its specific lipid-matrix composition.",
        reasoning_steps: [
          "Compared HLB values: soy lecithin 7–9, sunflower lecithin 7–9 — identical range.",
          "Reviewed 3 NutriLabs internal formulation trials confirming equivalence.",
          "Identified 5–10% use-rate adjustment required to compensate for minor potency difference.",
          "Flagged BiotechRx fish oil SGC as outlier requiring additional dissolution study.",
          "Regulatory acceptance confirmed: FDA GRAS, EFSA E476 equivalent, Health Canada.",
        ],
        cited_evidence_indices: [0, 1, 4],
      },
    },
    {
      keywords: ['lecico', 'sole source', 'why lecico', 'single source'],
      reply: {
        role: 'assistant',
        content: "LECICO GmbH is currently the only qualified source in the Spherecast network for Non-GMO + Organic sunflower lecithin at pharmaceutical emulsifier grade. Two alternatives (Olvea, Cargill specialty) were evaluated but don't hold the Non-GMO Project Verification required for the channel upgrade thesis. LECICO also co-qualifies all manufacturing sites in a single audit cycle. The single-source risk is real — the mitigation is to start Olvea qualification in parallel with the rollout.",
        reasoning_steps: [
          "Evaluated 3 potential sunflower lecithin suppliers: LECICO, Olvea, Cargill specialty.",
          "LECICO is only candidate with Non-GMO Project Verification + Organic cert combination.",
          "Non-GMO cert is prerequisite for the allergen-free channel upgrade thesis.",
          "LECICO offers portfolio-wide site qualification — one audit, all 4 companies.",
          "Recommended parallel Olvea qualification as secondary source to mitigate concentration risk.",
        ],
        cited_evidence_indices: [3],
      },
    },
    {
      keywords: ['which sku', 'skus', 'first', 'affected first', 'pilot', 'sequence', 'order'],
      reply: {
        role: 'assistant',
        content: "Conservative pilot starts with FG-WHEY-PRO-PWD (NutriLabs) and FG-PLANT-PRO-PWD (GreenHealth) — lowest regulatory complexity, standard emulsifier function, straightforward label change. FG-ENERGY-FOCUS-CAP and FG-COLLAGEN-BLEND-PWD come next. FG-FISHOIL-1000MG-SGC is last because BiotechRx needs additional dissolution validation — that's the gating item for full portfolio completion.",
        reasoning_steps: [
          "Ranked 5 affected SKUs by regulatory change-control complexity.",
          "FG-WHEY-PRO-PWD and FG-PLANT-PRO-PWD: emulsifier function only, no dissolution risk.",
          "FG-ENERGY-FOCUS-CAP: straightforward but needs NutriLabs QA sign-off.",
          "FG-COLLAGEN-BLEND-PWD: NovaRx, minimal complexity.",
          "FG-FISHOIL-1000MG-SGC: BiotechRx softgel requires dissolution study — schedule last.",
        ],
        cited_evidence_indices: [1],
      },
    },
    {
      keywords: ['revenue', 'upside', 'math', '1.2', 'channel', 'money', 'dollars'],
      reply: {
        role: 'assistant',
        content: "The $1.2M estimate comes from 4 new retail channels that currently restrict soy-containing supplements: Whole Foods 365, Trader Joe's, Target Clean, and Kroger SimpleNutrition. We modeled 15–20% incremental volume per channel per SKU based on analogous allergen-free placements. At average ASP weighted by the 5 affected SKUs, that yields $1.1M–$1.3M. The model is projection-based — actual channel negotiations determine realized upside — but the channel access is documented.",
        reasoning_steps: [
          "Identified 4 allergen-restricted retail chains that accept sunflower but not soy lecithin.",
          "Modeled 15–20% incremental volume lift per channel based on comparable allergen-free SKU data.",
          "Applied to average ASP across 5 affected SKUs weighted by current volume.",
          "Sensitivity range: $1.1M (conservative) to $1.3M (optimistic).",
          "Key assumption: successful buyer presentations in all 4 chains within 12 months of label change.",
        ],
        cited_evidence_indices: [2, 3],
      },
    },
  ],

  'opp-consolidate-mcc-ph101': [
    {
      keywords: ['formalize', 'already', 'why formalize', 'sole supplier', 'fmc already', 'already sole'],
      reply: {
        role: 'assistant',
        content: "'De facto single supplier' and 'portfolio MSA' are very different things commercially. Right now, 6 companies each have individual contracts with FMC negotiated independently — no volume bundling, no coordinated pricing. A portfolio MSA changes the dynamic: Spherecast becomes a named counterparty representing 8.2 MT/yr, which crosses FMC's Tier 2 threshold and unlocks a 12% further discount. Individual companies currently average Tier 1 pricing.",
        reasoning_steps: [
          "Identified current state: 6 separate bilateral contracts, no volume aggregation.",
          "FMC Tier 2 pricing threshold: 8.0 MT/yr — combined portfolio volume is 8.2 MT.",
          "Tier 2 delivers 12% unit cost reduction vs. blended current pricing.",
          "Portfolio MSA includes dedicated technical service team and coordinated batch scheduling.",
          "Single contract reduces annual legal/procurement overhead by ~$28k/yr.",
        ],
        cited_evidence_indices: [1, 3],
      },
    },
    {
      keywords: ['ashland', 'qualification', 'how long', 'qualify', 'weeks', 'secondary'],
      reply: {
        role: 'assistant',
        content: "Ashland's MCC PH101 qualification typically runs 10–14 weeks per site. With 6 sites, sequential qualification could take 6–9 months. The good news: MCC PH101 is a well-characterized excipient with extensive pharmacopoeia data — site-specific validation is minimal. Running all 6 in parallel with a common validation protocol compresses the timeline to 10–14 weeks total, at ~$40k across all sites.",
        reasoning_steps: [
          "Standard Ashland MCC qualification protocol: 10–14 weeks per site (analytical, compaction, stability).",
          "6 manufacturing sites across portfolio companies.",
          "Parallel validation with common protocol: 10–14 weeks total vs. 60–84 weeks sequential.",
          "MCC PH101 USP/EP/JP pharmacopoeia monograph coverage reduces site-specific testing.",
          "$40k validation cost estimate based on Ashland standard qualification package.",
        ],
        cited_evidence_indices: [0, 2],
      },
    },
    {
      keywords: ['12%', 'discount', 'based on', 'tier', 'pricing', 'how much', 'savings'],
      reply: {
        role: 'assistant',
        content: "FMC's pricing tiers are volume-based. Our 6 companies collectively consume 8.2 MT/yr — just above FMC's Tier 2 threshold of 8.0 MT/yr. Tier 2 discount bracket is 10–14% off list; we've modeled the midpoint at 12%. All 6 companies currently sit at Tier 1 individually. Applied to combined spend, that translates to $85k–$110k in annual savings.",
        reasoning_steps: [
          "FMC volume tiers: Tier 1 = <8 MT/yr, Tier 2 = 8–20 MT/yr, Tier 3 = >20 MT/yr.",
          "Portfolio combined volume: 8.2 MT/yr (just above Tier 2 threshold).",
          "Tier 2 discount range: 10–14% off list, midpoint 12%.",
          "All 6 companies currently at Tier 1 pricing individually.",
          "12% incremental savings on combined spend → $85k–$110k/yr.",
        ],
        cited_evidence_indices: [1],
      },
    },
    {
      keywords: ['risk', 'negotiation', 'msa', 'during negotiation', 'negotiating', 'leverage'],
      reply: {
        role: 'assistant',
        content: "The main risk is leverage asymmetry: once FMC knows we have no qualified backup, they may resist Tier 2 pricing or add unfavorable terms. Mitigation: begin Ashland qualification before — or simultaneously with — the MSA negotiation. 'We're in Ashland qualification and will formalize with either FMC or Ashland depending on MSA terms' is a far stronger position than 'We want a portfolio MSA.'",
        reasoning_steps: [
          "Single-supplier scenario gives FMC full negotiating leverage during MSA discussions.",
          "Risk: FMC declines Tier 2 or adds price-lock terms unfavorable to Spherecast.",
          "Mitigation: initiate Ashland qualification before MSA negotiation commences.",
          "Credible secondary source shifts negotiating leverage back to Spherecast.",
          "Recommended sequencing: Ashland qualification kick-off Month 1, MSA negotiation Month 2.",
        ],
        cited_evidence_indices: [2, 3],
      },
    },
  ],
}

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

export function getRawMaterialsForSupplier(supplierId: string): RawMaterial[] {
  return SUPPLIER_RAW_MATERIALS
    .filter((srm) => srm.supplier_id === supplierId)
    .map((srm) => getRawMaterial(srm.raw_material_id))
    .filter((r): r is RawMaterial => r != null)
}

export function getCompaniesForSupplier(supplierId: string): Company[] {
  const rmIds = new Set(
    SUPPLIER_RAW_MATERIALS
      .filter((srm) => srm.supplier_id === supplierId)
      .map((srm) => srm.raw_material_id)
  )
  const companyIds = new Set(
    BOMS
      .filter((b) => b.consumed_raw_material_ids.some((id) => rmIds.has(id)))
      .map((b) => PRODUCTS.find((p) => p.id === b.produced_product_id)?.company_id)
      .filter((id): id is string => id != null)
  )
  return COMPANIES.filter((c) => companyIds.has(c.id))
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

export function getProposals(): Proposal[] {
  return [...PROPOSALS].sort((a, b) => b.fragmentation_score - a.fragmentation_score)
}

export function getProposal(id: string): Proposal | undefined {
  return PROPOSALS.find((o) => o.id === id)
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
    proposals: PROPOSALS.length,
  }
}
