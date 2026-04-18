// ─── Types ───────────────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  product_ids: string[];
}

export interface Product {
  id: string;
  name: string;
  company_id: string;
  ingredient_ids: string[];
  compliance_tags: string[];
}

export interface Ingredient {
  id: string;
  canonical_name: string;
  raw_name: string;
  category: string;
  allergen_tags: string[];
  supplier_ids: string[];
}

export interface Supplier {
  id: string;
  name: string;
  certifications: string[];
  served_ingredients: string[];
  served_companies: string[];
}

export interface ConsolidationGroup {
  canonical_ingredient_id: string;
  companies: string[];
  current_suppliers: string[];
  fragmentation_score: number;
  proposed_supplier_id: string;
  tradeoffs: { gained: string[]; atRisk: string[] };
  nonAggressive: {
    affected_skus: number;
    timeline: string;
    backup_supplier_id?: string;
    company_supplier_rows: { company_id: string; supplier_id: string }[];
  };
  aggressive: {
    affected_skus: number;
    timeline: string;
    company_supplier_rows: { company_id: string; supplier_id: string }[];
  };
}

export interface SubstitutionProposal {
  from_ingredient_id: string;
  to_ingredient_id: string;
  equivalence_confidence: number;
  equivalence_reasoning: string;
  compliance_delta: string;
  affected_skus: string[];
  nonAggressive: {
    affected_skus: string[];
    timeline: string;
    backup_supplier_id?: string;
  };
  aggressive: {
    affected_skus: string[];
    timeline: string;
  };
}

export interface EvidenceItem {
  claim: string;
  source: string;
  url?: string;
}

// ─── Seed data ───────────────────────────────────────────────────────────────

export const SUPPLIERS: Supplier[] = [
  {
    id: "jost-chemical",
    name: "Jost Chemical",
    certifications: ["USP", "GMP", "Kosher", "ISO 9001"],
    served_ingredients: ["magnesium-stearate", "zinc-oxide"],
    served_companies: ["pharma-co", "nutri-labs", "biotech-rx"],
  },
  {
    id: "peter-greven",
    name: "Peter Greven",
    certifications: ["USP", "GMP", "Halal", "Kosher"],
    served_ingredients: ["magnesium-stearate"],
    served_companies: ["wellness-plus", "vita-core"],
  },
  {
    id: "mallinckrodt",
    name: "Mallinckrodt Pharma",
    certifications: ["USP", "cGMP", "FDA Registered"],
    served_ingredients: ["magnesium-stearate"],
    served_companies: ["apex-pharma"],
  },
  {
    id: "chemwerth",
    name: "Chemwerth Inc.",
    certifications: ["USP", "GMP", "ISO 9001"],
    served_ingredients: ["magnesium-stearate", "zinc-oxide"],
    served_companies: ["green-health", "nova-nutraceuticals"],
  },
  {
    id: "cargill",
    name: "Cargill",
    certifications: ["Non-GMO", "Kosher", "NSF", "Organic"],
    served_ingredients: ["soy-lecithin", "starch", "sunflower-oil"],
    served_companies: ["nutri-labs", "green-health", "vita-core"],
  },
  {
    id: "adt",
    name: "American Lecithin (ADT)",
    certifications: ["NSF", "GMP", "Kosher"],
    served_ingredients: ["soy-lecithin"],
    served_companies: ["biotech-rx", "nova-nutraceuticals"],
  },
  {
    id: "lecico",
    name: "LECICO GmbH",
    certifications: ["Non-GMO", "Organic", "GMP", "Halal"],
    served_ingredients: ["sunflower-lecithin"],
    served_companies: ["green-health", "vita-core"],
  },
  {
    id: "dsm",
    name: "DSM Nutritional Products",
    certifications: ["USP", "GMP", "Halal", "Kosher", "Non-GMO"],
    served_ingredients: ["vitamin-d3", "ascorbic-acid", "fish-oil"],
    served_companies: ["pharma-co", "nutri-labs", "vita-core", "nova-nutraceuticals", "green-health"],
  },
  {
    id: "rousselot",
    name: "Rousselot",
    certifications: ["Halal", "Kosher", "GMP"],
    served_ingredients: ["gelatin", "collagen-peptides"],
    served_companies: ["biotech-rx", "nova-nutraceuticals"],
  },
  {
    id: "fmc-biopolymer",
    name: "FMC Biopolymer",
    certifications: ["USP", "GMP", "Non-GMO", "ISO 9001"],
    served_ingredients: ["microcrystalline-cellulose", "silicon-dioxide", "hpmc"],
    served_companies: ["pharma-co", "biotech-rx", "wellness-plus", "vita-core", "apex-pharma", "nutri-labs"],
  },
];

export const INGREDIENTS: Ingredient[] = [
  {
    id: "magnesium-stearate",
    canonical_name: "Magnesium Stearate",
    raw_name: "Magnesium stearate",
    category: "Excipient",
    allergen_tags: [],
    supplier_ids: ["jost-chemical", "peter-greven", "mallinckrodt", "chemwerth"],
  },
  {
    id: "soy-lecithin",
    canonical_name: "Soy Lecithin",
    raw_name: "Lecithin (soy)",
    category: "Emulsifier",
    allergen_tags: ["Soy"],
    supplier_ids: ["cargill", "adt"],
  },
  {
    id: "sunflower-lecithin",
    canonical_name: "Sunflower Lecithin",
    raw_name: "Sunflower lecithin",
    category: "Emulsifier",
    allergen_tags: [],
    supplier_ids: ["lecico"],
  },
  {
    id: "microcrystalline-cellulose",
    canonical_name: "Microcrystalline Cellulose",
    raw_name: "MCC PH101",
    category: "Excipient / Binder",
    allergen_tags: [],
    supplier_ids: ["fmc-biopolymer"],
  },
  {
    id: "silicon-dioxide",
    canonical_name: "Silicon Dioxide",
    raw_name: "Silica, fumed",
    category: "Flow Agent",
    allergen_tags: [],
    supplier_ids: ["fmc-biopolymer"],
  },
  {
    id: "vitamin-d3",
    canonical_name: "Cholecalciferol (Vitamin D3)",
    raw_name: "Vitamin D3 (cholecalciferol)",
    category: "Active Vitamin",
    allergen_tags: [],
    supplier_ids: ["dsm"],
  },
  {
    id: "fish-oil",
    canonical_name: "Fish Oil (EPA/DHA)",
    raw_name: "Omega-3 fish oil concentrate",
    category: "Active Lipid",
    allergen_tags: ["Fish"],
    supplier_ids: ["dsm"],
  },
  {
    id: "sunflower-oil",
    canonical_name: "Sunflower Oil",
    raw_name: "High-oleic sunflower oil",
    category: "Carrier Oil",
    allergen_tags: [],
    supplier_ids: ["cargill"],
  },
  {
    id: "gelatin",
    canonical_name: "Gelatin",
    raw_name: "Gelatin, bovine",
    category: "Capsule Shell",
    allergen_tags: [],
    supplier_ids: ["rousselot"],
  },
  {
    id: "hpmc",
    canonical_name: "HPMC (Hypromellose)",
    raw_name: "Hydroxypropyl methylcellulose",
    category: "Capsule Shell / Excipient",
    allergen_tags: [],
    supplier_ids: ["fmc-biopolymer"],
  },
  {
    id: "zinc-oxide",
    canonical_name: "Zinc Oxide",
    raw_name: "Zinc oxide USP",
    category: "Active Mineral",
    allergen_tags: [],
    supplier_ids: ["jost-chemical", "chemwerth"],
  },
  {
    id: "collagen-peptides",
    canonical_name: "Collagen Peptides",
    raw_name: "Hydrolyzed collagen peptides (bovine)",
    category: "Active Protein",
    allergen_tags: [],
    supplier_ids: ["rousselot"],
  },
  {
    id: "ascorbic-acid",
    canonical_name: "Ascorbic Acid (Vitamin C)",
    raw_name: "L-Ascorbic acid",
    category: "Active / Antioxidant",
    allergen_tags: [],
    supplier_ids: ["dsm"],
  },
  {
    id: "starch",
    canonical_name: "Corn Starch",
    raw_name: "Maize starch",
    category: "Excipient / Binder",
    allergen_tags: ["Corn"],
    supplier_ids: ["cargill"],
  },
];

export const COMPANIES: Company[] = [
  {
    id: "pharma-co",
    name: "PharmaCo",
    product_ids: ["omeprazole-caps", "vitamin-d3-tabs", "metformin-tabs"],
  },
  {
    id: "nutri-labs",
    name: "NutriLabs",
    product_ids: ["protein-shake", "multivitamin", "energy-blend"],
  },
  {
    id: "biotech-rx",
    name: "BiotechRx",
    product_ids: ["probiotic-caps", "fish-oil-softgels"],
  },
  {
    id: "wellness-plus",
    name: "WellnessPlus",
    product_ids: ["sleep-support", "magnesium-complex"],
  },
  {
    id: "green-health",
    name: "GreenHealth",
    product_ids: ["organic-omega", "plant-protein"],
  },
  {
    id: "vita-core",
    name: "VitaCore",
    product_ids: ["b-complex", "calcium-d3", "immune-boost"],
  },
  {
    id: "apex-pharma",
    name: "ApexPharma",
    product_ids: ["ibuprofen-tabs", "allergy-relief"],
  },
  {
    id: "nova-nutraceuticals",
    name: "NovaRx",
    product_ids: ["joint-support", "collagen-blend"],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "omeprazole-caps",
    name: "Omeprazole 20mg Capsules",
    company_id: "pharma-co",
    ingredient_ids: ["magnesium-stearate", "microcrystalline-cellulose", "hpmc", "silicon-dioxide"],
    compliance_tags: ["USP", "GMP"],
  },
  {
    id: "vitamin-d3-tabs",
    name: "Vitamin D3 2000IU Tablets",
    company_id: "pharma-co",
    ingredient_ids: ["vitamin-d3", "magnesium-stearate", "microcrystalline-cellulose", "starch"],
    compliance_tags: ["USP", "GMP", "Non-GMO"],
  },
  {
    id: "metformin-tabs",
    name: "Metformin 500mg Tablets",
    company_id: "pharma-co",
    ingredient_ids: ["magnesium-stearate", "microcrystalline-cellulose", "starch"],
    compliance_tags: ["USP", "GMP"],
  },
  {
    id: "protein-shake",
    name: "Whey Protein Blend",
    company_id: "nutri-labs",
    ingredient_ids: ["soy-lecithin", "sunflower-oil", "ascorbic-acid"],
    compliance_tags: ["NSF", "GMP"],
  },
  {
    id: "multivitamin",
    name: "Daily Multivitamin",
    company_id: "nutri-labs",
    ingredient_ids: ["magnesium-stearate", "vitamin-d3", "zinc-oxide", "ascorbic-acid", "microcrystalline-cellulose"],
    compliance_tags: ["NSF", "GMP", "Non-GMO"],
  },
  {
    id: "energy-blend",
    name: "Energy & Focus Blend",
    company_id: "nutri-labs",
    ingredient_ids: ["soy-lecithin", "ascorbic-acid", "magnesium-stearate"],
    compliance_tags: ["NSF", "GMP"],
  },
  {
    id: "probiotic-caps",
    name: "Probiotic 50B CFU",
    company_id: "biotech-rx",
    ingredient_ids: ["magnesium-stearate", "hpmc", "microcrystalline-cellulose"],
    compliance_tags: ["GMP", "Allergen-Free"],
  },
  {
    id: "fish-oil-softgels",
    name: "Omega-3 Fish Oil 1000mg",
    company_id: "biotech-rx",
    ingredient_ids: ["fish-oil", "gelatin", "soy-lecithin"],
    compliance_tags: ["IFOS", "GMP"],
  },
  {
    id: "sleep-support",
    name: "Sleep Support Complex",
    company_id: "wellness-plus",
    ingredient_ids: ["magnesium-stearate", "hpmc", "silicon-dioxide"],
    compliance_tags: ["GMP", "Non-GMO"],
  },
  {
    id: "magnesium-complex",
    name: "Magnesium Glycinate Complex",
    company_id: "wellness-plus",
    ingredient_ids: ["magnesium-stearate", "microcrystalline-cellulose", "starch"],
    compliance_tags: ["GMP", "USP"],
  },
  {
    id: "organic-omega",
    name: "Organic Omega Blend",
    company_id: "green-health",
    ingredient_ids: ["fish-oil", "sunflower-lecithin", "sunflower-oil"],
    compliance_tags: ["USDA Organic", "IFOS"],
  },
  {
    id: "plant-protein",
    name: "Plant Protein Isolate",
    company_id: "green-health",
    ingredient_ids: ["soy-lecithin", "ascorbic-acid", "silicon-dioxide", "magnesium-stearate"],
    compliance_tags: ["Vegan", "Non-GMO"],
  },
  {
    id: "b-complex",
    name: "B-Complex 100",
    company_id: "vita-core",
    ingredient_ids: ["magnesium-stearate", "microcrystalline-cellulose", "ascorbic-acid"],
    compliance_tags: ["USP", "GMP"],
  },
  {
    id: "calcium-d3",
    name: "Calcium + D3",
    company_id: "vita-core",
    ingredient_ids: ["vitamin-d3", "magnesium-stearate", "starch"],
    compliance_tags: ["USP", "GMP"],
  },
  {
    id: "immune-boost",
    name: "Immune Boost Formula",
    company_id: "vita-core",
    ingredient_ids: ["ascorbic-acid", "zinc-oxide", "magnesium-stearate", "microcrystalline-cellulose"],
    compliance_tags: ["USP", "GMP", "Non-GMO"],
  },
  {
    id: "ibuprofen-tabs",
    name: "Ibuprofen 200mg Tablets",
    company_id: "apex-pharma",
    ingredient_ids: ["magnesium-stearate", "microcrystalline-cellulose", "starch"],
    compliance_tags: ["USP", "GMP"],
  },
  {
    id: "allergy-relief",
    name: "Allergy Relief Tablets",
    company_id: "apex-pharma",
    ingredient_ids: ["magnesium-stearate", "silicon-dioxide", "hpmc"],
    compliance_tags: ["USP", "GMP", "Allergen-Free"],
  },
  {
    id: "joint-support",
    name: "Joint Support Formula",
    company_id: "nova-nutraceuticals",
    ingredient_ids: ["collagen-peptides", "vitamin-d3", "magnesium-stearate"],
    compliance_tags: ["GMP", "Non-GMO"],
  },
  {
    id: "collagen-blend",
    name: "Marine Collagen Blend",
    company_id: "nova-nutraceuticals",
    ingredient_ids: ["collagen-peptides", "ascorbic-acid", "zinc-oxide", "soy-lecithin"],
    compliance_tags: ["GMP", "Halal"],
  },
];

export const CONSOLIDATION_GROUPS: ConsolidationGroup[] = [
  {
    canonical_ingredient_id: "magnesium-stearate",
    companies: ["pharma-co", "nutri-labs", "biotech-rx", "wellness-plus", "green-health", "vita-core", "apex-pharma", "nova-nutraceuticals"],
    current_suppliers: ["jost-chemical", "peter-greven", "mallinckrodt", "chemwerth"],
    fragmentation_score: 87,
    proposed_supplier_id: "jost-chemical",
    tradeoffs: {
      gained: [
        "15–18% cost reduction (~$240k/yr across portfolio)",
        "Single audit cycle replaces 4 annual supplier audits",
        "Unified CoA format reduces QA processing time by ~60%",
        "Volume tier unlocks Jost's dedicated batch allocation",
      ],
      atRisk: [
        "Single-source concentration risk without secondary qualification",
        "Peter Greven's Halal cert not matched by Jost (affects 2 WellnessPlus SKUs)",
        "Mallinckrodt's FDA-registered facility adds regulatory comfort for ApexPharma",
      ],
    },
    nonAggressive: {
      affected_skus: 8,
      timeline: "9–12 months phased rollout — pharma-co and nutri-labs first (Q1), remaining 6 companies in Q2–Q3",
      backup_supplier_id: "peter-greven",
      company_supplier_rows: [
        { company_id: "pharma-co", supplier_id: "jost-chemical" },
        { company_id: "nutri-labs", supplier_id: "jost-chemical" },
        { company_id: "biotech-rx", supplier_id: "jost-chemical" },
        { company_id: "wellness-plus", supplier_id: "peter-greven" },
        { company_id: "vita-core", supplier_id: "peter-greven" },
        { company_id: "apex-pharma", supplier_id: "mallinckrodt" },
        { company_id: "green-health", supplier_id: "chemwerth" },
        { company_id: "nova-nutraceuticals", supplier_id: "chemwerth" },
      ],
    },
    aggressive: {
      affected_skus: 19,
      timeline: "3–4 months full cutover — all 8 companies simultaneously, bridge stock from Jost pre-ordered in month 1",
      company_supplier_rows: [
        { company_id: "pharma-co", supplier_id: "jost-chemical" },
        { company_id: "nutri-labs", supplier_id: "jost-chemical" },
        { company_id: "biotech-rx", supplier_id: "jost-chemical" },
        { company_id: "wellness-plus", supplier_id: "jost-chemical" },
        { company_id: "vita-core", supplier_id: "jost-chemical" },
        { company_id: "apex-pharma", supplier_id: "jost-chemical" },
        { company_id: "green-health", supplier_id: "jost-chemical" },
        { company_id: "nova-nutraceuticals", supplier_id: "jost-chemical" },
      ],
    },
  },
  {
    canonical_ingredient_id: "soy-lecithin",
    companies: ["nutri-labs", "biotech-rx", "green-health", "nova-nutraceuticals"],
    current_suppliers: ["cargill", "adt"],
    fragmentation_score: 62,
    proposed_supplier_id: "cargill",
    tradeoffs: {
      gained: [
        "8–10% volume discount by unifying 4 companies under Cargill",
        "Cargill's Non-GMO + NSF certs cover all portfolio requirements",
        "Unified CoA format reduces per-lot QA review",
      ],
      atRisk: [
        "ADT's NSF cert overlap — Cargill already covers, but ADT relationship ends",
        "BiotechRx and NovaRx would need new Cargill qualification (6–8 weeks)",
      ],
    },
    nonAggressive: {
      affected_skus: 3,
      timeline: "6–9 months — nutri-labs and green-health switch first (already on Cargill), then biotech-rx and nova-nutraceuticals",
      backup_supplier_id: "adt",
      company_supplier_rows: [
        { company_id: "nutri-labs", supplier_id: "cargill" },
        { company_id: "biotech-rx", supplier_id: "adt" },
        { company_id: "green-health", supplier_id: "cargill" },
        { company_id: "nova-nutraceuticals", supplier_id: "adt" },
      ],
    },
    aggressive: {
      affected_skus: 5,
      timeline: "2–3 months — all 4 companies switch simultaneously; Cargill pre-qualified at nutri-labs and green-health reduces risk",
      company_supplier_rows: [
        { company_id: "nutri-labs", supplier_id: "cargill" },
        { company_id: "biotech-rx", supplier_id: "cargill" },
        { company_id: "green-health", supplier_id: "cargill" },
        { company_id: "nova-nutraceuticals", supplier_id: "cargill" },
      ],
    },
  },
  {
    canonical_ingredient_id: "microcrystalline-cellulose",
    companies: ["pharma-co", "nutri-labs", "biotech-rx", "wellness-plus", "vita-core", "apex-pharma"],
    current_suppliers: ["fmc-biopolymer"],
    fragmentation_score: 44,
    proposed_supplier_id: "fmc-biopolymer",
    tradeoffs: {
      gained: [
        "Already consolidated — 12% further discount via portfolio-level volume agreement",
        "FMC's dedicated technical service team for all 6 companies",
        "Single master supplier agreement replaces 6 individual contracts",
      ],
      atRisk: [
        "No secondary qualification if FMC has supply disruption",
        "Portfolio-wide exposure if FMC quality event occurs",
      ],
    },
    nonAggressive: {
      affected_skus: 6,
      timeline: "4–6 months — formalize portfolio agreement with FMC, add Ashland as qualified backup",
      backup_supplier_id: "fmc-biopolymer",
      company_supplier_rows: [
        { company_id: "pharma-co", supplier_id: "fmc-biopolymer" },
        { company_id: "nutri-labs", supplier_id: "fmc-biopolymer" },
        { company_id: "biotech-rx", supplier_id: "fmc-biopolymer" },
        { company_id: "wellness-plus", supplier_id: "fmc-biopolymer" },
        { company_id: "vita-core", supplier_id: "fmc-biopolymer" },
        { company_id: "apex-pharma", supplier_id: "fmc-biopolymer" },
      ],
    },
    aggressive: {
      affected_skus: 11,
      timeline: "2–3 months — execute portfolio MSA immediately, all companies co-sign in Q1",
      company_supplier_rows: [
        { company_id: "pharma-co", supplier_id: "fmc-biopolymer" },
        { company_id: "nutri-labs", supplier_id: "fmc-biopolymer" },
        { company_id: "biotech-rx", supplier_id: "fmc-biopolymer" },
        { company_id: "wellness-plus", supplier_id: "fmc-biopolymer" },
        { company_id: "vita-core", supplier_id: "fmc-biopolymer" },
        { company_id: "apex-pharma", supplier_id: "fmc-biopolymer" },
      ],
    },
  },
  {
    canonical_ingredient_id: "vitamin-d3",
    companies: ["pharma-co", "nutri-labs", "vita-core", "nova-nutraceuticals"],
    current_suppliers: ["dsm"],
    fragmentation_score: 38,
    proposed_supplier_id: "dsm",
    tradeoffs: {
      gained: [
        "5–7% cost reduction via consolidated volume tier with DSM",
        "DSM's direct technical application support across 4 companies",
        "Single Certificate of Analysis standard for regulatory submissions",
      ],
      atRisk: [
        "Single-source risk — no BASF qualification in place",
        "DSM price negotiations harder without a credible alternative",
      ],
    },
    nonAggressive: {
      affected_skus: 4,
      timeline: "8–10 months — negotiate portfolio agreement with DSM, qualify BASF as backup in parallel",
      backup_supplier_id: "dsm",
      company_supplier_rows: [
        { company_id: "pharma-co", supplier_id: "dsm" },
        { company_id: "nutri-labs", supplier_id: "dsm" },
        { company_id: "vita-core", supplier_id: "dsm" },
        { company_id: "nova-nutraceuticals", supplier_id: "dsm" },
      ],
    },
    aggressive: {
      affected_skus: 5,
      timeline: "4–5 months — execute DSM portfolio MSA immediately; back-qualify BASF within 6 months",
      company_supplier_rows: [
        { company_id: "pharma-co", supplier_id: "dsm" },
        { company_id: "nutri-labs", supplier_id: "dsm" },
        { company_id: "vita-core", supplier_id: "dsm" },
        { company_id: "nova-nutraceuticals", supplier_id: "dsm" },
      ],
    },
  },
];

export const SUBSTITUTION_PROPOSALS: SubstitutionProposal[] = [
  {
    from_ingredient_id: "soy-lecithin",
    to_ingredient_id: "sunflower-lecithin",
    equivalence_confidence: 92,
    equivalence_reasoning:
      "Functionally equivalent emulsifier in identical HLB range (7–9). Sunflower lecithin requires a 5–10% higher use rate to match emulsification capacity — a minor reformulation with no impact on tablet hardness or dissolution. Phospholipid profile is comparable; regulatory precedent exists in EU, US, and APAC markets. Cost delta is negligible (<2%).",
    compliance_delta:
      "Eliminates soy allergen declaration on all switched SKUs, enabling entry into allergen-restricted markets (schools, hospitals). Non-GMO certification auto-upgraded on all switched SKUs. No new allergen or regulatory approval required.",
    affected_skus: ["protein-shake", "fish-oil-softgels", "plant-protein", "collagen-blend", "energy-blend"],
    nonAggressive: {
      affected_skus: ["protein-shake", "plant-protein"],
      timeline: "6–8 months pilot — start with protein-shake and plant-protein (lowest regulatory complexity); validate dissolution and shelf-life",
      backup_supplier_id: "lecico",
    },
    aggressive: {
      affected_skus: ["protein-shake", "fish-oil-softgels", "plant-protein", "collagen-blend", "energy-blend"],
      timeline: "3–4 months full portfolio switch — parallel reformulation at all 4 companies; LECICO pre-qualifies all sites in month 1",
    },
  },
  {
    from_ingredient_id: "gelatin",
    to_ingredient_id: "hpmc",
    equivalence_confidence: 78,
    equivalence_reasoning:
      "HPMC (hypromellose) capsule shells provide equivalent drug/nutrient containment and dissolution profiles approved in all major regulatory markets. Dissolution rate may differ by 5–10 minutes — bioequivalence study recommended for pharmaceutical SKUs. Vegan-compliant and free from bovine sourcing concerns.",
    compliance_delta:
      "Adds Vegan and Plant-Based certifications to switched SKUs. Removes bovine allergen risk from supply chain. Expands addressable market to vegan/vegetarian consumers (~10% of supplement buyers).",
    affected_skus: ["fish-oil-softgels", "joint-support"],
    nonAggressive: {
      affected_skus: ["joint-support"],
      timeline: "8–10 months pilot — joint-support first (nutraceutical, lower regulatory bar); fish-oil-softgels requires bioequivalence data",
      backup_supplier_id: "fmc-biopolymer",
    },
    aggressive: {
      affected_skus: ["fish-oil-softgels", "joint-support"],
      timeline: "4–5 months — run bioequivalence study in parallel with HPMC qualification; full cutover on positive data",
    },
  },
  {
    from_ingredient_id: "starch",
    to_ingredient_id: "microcrystalline-cellulose",
    equivalence_confidence: 85,
    equivalence_reasoning:
      "MCC PH101 grade enables direct-compression manufacturing, eliminating the wet granulation step currently required for native corn starch. Compressibility and flow are superior. Disintegration time is comparable (< 30 min in all tested grades). Both are pharmacopoeially approved; no new regulatory filings needed.",
    compliance_delta:
      "Removes corn allergen declaration on switched SKUs. Enables direct-compression at 3 manufacturing sites, reducing cycle time by ~40% and energy cost per batch by ~25%. MCC is already qualified at all 6 sites via fmc-biopolymer.",
    affected_skus: ["vitamin-d3-tabs", "metformin-tabs", "magnesium-complex", "ibuprofen-tabs", "calcium-d3"],
    nonAggressive: {
      affected_skus: ["metformin-tabs", "vitamin-d3-tabs"],
      timeline: "6–9 months — start with metformin-tabs and vitamin-d3-tabs (pharma-co already has MCC fully qualified)",
      backup_supplier_id: "fmc-biopolymer",
    },
    aggressive: {
      affected_skus: ["vitamin-d3-tabs", "metformin-tabs", "magnesium-complex", "ibuprofen-tabs", "calcium-d3"],
      timeline: "3–5 months full switch — MCC already qualified at all affected sites; parallel change controls filed simultaneously",
    },
  },
];

// ─── Evidence (used inline in pitch pages) ───────────────────────────────────

export const CONSOLIDATION_EVIDENCE: Record<string, EvidenceItem[]> = {
  "magnesium-stearate": [
    {
      claim: "Jost Chemical holds USP, GMP, Kosher, and ISO 9001 certifications — covering all portfolio compliance requirements.",
      source: "Jost Chemical supplier qualification dossier, rev. 2024",
    },
    {
      claim: "Portfolio spend on magnesium stearate across 8 companies is estimated at ~$1.4M/yr; a 15–18% volume discount yields $210–252k in annual savings.",
      source: "Spherecast procurement analysis, Q4 2024",
    },
    {
      claim: "Consolidating to a single supplier reduces annual audit burden from 4 audits (avg. $18k each) to 1, saving ~$54k/yr in audit costs.",
      source: "Internal Spherecast audit cost model",
    },
    {
      claim: "Peter Greven's Halal certification is not currently matched by Jost Chemical; WellnessPlus has 2 Halal-labelled SKUs that would require supplier variance or reformulation.",
      source: "WellnessPlus compliance team, Jan 2025",
    },
    {
      claim: "Magnesium stearate supply disruptions are rare (< 0.5% annual incidence for top-tier suppliers) but portfolio-wide single-source exposure would affect all 19 SKUs simultaneously.",
      source: "PharmaTech Supply Risk Report 2024",
    },
  ],
  "soy-lecithin": [
    {
      claim: "Cargill's Non-GMO Project Verified and NSF certifications cover all 4 portfolio companies' labelling requirements for soy lecithin.",
      source: "Cargill supplier qualification dossier, rev. 2023",
    },
    {
      claim: "Consolidated volume across nutri-labs, biotech-rx, green-health, and nova-nutraceuticals qualifies for Cargill's Tier 3 pricing, delivering 8–10% unit cost reduction.",
      source: "Cargill pricing schedule, Q3 2024",
    },
    {
      claim: "BiotechRx and NovaRx would require a Cargill supplier qualification (estimated 6–8 weeks) before purchasing; current ADT contracts have 30-day termination clauses.",
      source: "BiotechRx supplier qualification SOP v3.1",
    },
    {
      claim: "ADT's unique Kosher certification does not add value beyond Cargill's Kosher cert; ADT's certifications are a strict subset of Cargill's.",
      source: "Spherecast supplier cert matrix, Jan 2025",
    },
  ],
};

export const SUBSTITUTION_EVIDENCE: Record<string, EvidenceItem[]> = {
  "soy-lecithin": [
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
  "gelatin": [
    {
      claim: "HPMC capsule shells are approved in USP <711> and Ph. Eur. 2.9.3 as equivalent to gelatin for dissolution testing purposes.",
      source: "USP <711> Dissolution, 2024 edition",
    },
    {
      claim: "Vegan supplement buyers represent ~11% of the US supplement market and are the fastest-growing consumer segment (14% YoY growth).",
      source: "SPINS Natural Channel Data 2024",
    },
    {
      claim: "FMC Biopolymer's HPMC is already qualified at all 6 affected manufacturing sites, reducing qualification lead time from 12 weeks to 3.",
      source: "Spherecast supplier qualification register, Q4 2024",
    },
  ],
  "starch": [
    {
      claim: "MCC PH101 enables direct-compression tableting, eliminating wet granulation and reducing batch cycle time by ~40% in pharma-co's validated studies.",
      source: "PharmaCo manufacturing engineering report, Aug 2024",
    },
    {
      claim: "Removal of corn starch eliminates the corn allergen declaration, opening 2 new private-label contracts that require allergen-free supply chains.",
      source: "ApexPharma commercial development memo, Dec 2024",
    },
    {
      claim: "MCC is already qualified at all 6 affected manufacturing sites via FMC Biopolymer, with no additional qualification costs required.",
      source: "Spherecast supplier qualification register, Q4 2024",
    },
    {
      claim: "Direct compression with MCC reduces energy cost per batch by ~25% (no drying step) and waste by ~15% (no granulation losses).",
      source: "FMC Biopolymer application note MCC-DC-2022",
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getCompany(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getIngredient(id: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.id === id);
}

export function getSupplier(id: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.id === id);
}

export function getConsolidationFor(ingredientId: string): ConsolidationGroup | undefined {
  return CONSOLIDATION_GROUPS.find((g) => g.canonical_ingredient_id === ingredientId);
}

export function getSubstitutionFor(ingredientId: string): SubstitutionProposal | undefined {
  return SUBSTITUTION_PROPOSALS.find((s) => s.from_ingredient_id === ingredientId);
}

export function getProductsForCompany(companyId: string): Product[] {
  return PRODUCTS.filter((p) => p.company_id === companyId);
}

export function getCompaniesUsingIngredient(ingredientId: string): Company[] {
  const companyIds = new Set(
    PRODUCTS.filter((p) => p.ingredient_ids.includes(ingredientId)).map((p) => p.company_id)
  );
  return COMPANIES.filter((c) => companyIds.has(c.id));
}

export function getProductsUsingIngredient(ingredientId: string): Product[] {
  return PRODUCTS.filter((p) => p.ingredient_ids.includes(ingredientId));
}

export function getPortfolioStats() {
  const allIngredientIds = new Set(PRODUCTS.flatMap((p) => p.ingredient_ids));
  const allSupplierIds = new Set(INGREDIENTS.filter((i) => allIngredientIds.has(i.id)).flatMap((i) => i.supplier_ids));
  return {
    companies: COMPANIES.length,
    products: PRODUCTS.length,
    ingredients: allIngredientIds.size,
    suppliers: allSupplierIds.size,
    consolidationOpps: CONSOLIDATION_GROUPS.length,
    substitutionOpps: SUBSTITUTION_PROPOSALS.length,
  };
}

export function getTopConsolidationOpportunities() {
  return [...CONSOLIDATION_GROUPS]
    .sort((a, b) => b.fragmentation_score - a.fragmentation_score)
    .map((g) => ({
      ingredient: getIngredient(g.canonical_ingredient_id)!,
      companies: g.companies.length,
      suppliers: g.current_suppliers.length,
      fragmentation_score: g.fragmentation_score,
      proposed_supplier: getSupplier(g.proposed_supplier_id)!,
    }));
}

export function getTopSubstitutionOpportunities() {
  return [...SUBSTITUTION_PROPOSALS]
    .sort((a, b) => b.equivalence_confidence - a.equivalence_confidence)
    .map((s) => ({
      from: getIngredient(s.from_ingredient_id)!,
      to: getIngredient(s.to_ingredient_id)!,
      confidence: s.equivalence_confidence,
      compliance_delta: s.compliance_delta,
      affected_skus: s.affected_skus.length,
    }));
}

export function getIngredientOverlapScore(companyId: string): {
  sharedWith: number;
  sharedIngredients: number;
} {
  const company = getCompany(companyId);
  if (!company) return { sharedWith: 0, sharedIngredients: 0 };
  const products = getProductsForCompany(companyId);
  const ownIngredients = new Set(products.flatMap((p) => p.ingredient_ids));
  const otherCompanyIds = new Set<string>();
  let sharedCount = 0;
  for (const ingredientId of ownIngredients) {
    const companies = getCompaniesUsingIngredient(ingredientId);
    const others = companies.filter((c) => c.id !== companyId);
    if (others.length > 0) sharedCount++;
    others.forEach((c) => otherCompanyIds.add(c.id));
  }
  return { sharedWith: otherCompanyIds.size, sharedIngredients: sharedCount };
}

export function getSupplierForCompanyIngredient(companyId: string, ingredientId: string): Supplier | undefined {
  const group = CONSOLIDATION_GROUPS.find((g) => g.canonical_ingredient_id === ingredientId);
  if (group) {
    const row = group.nonAggressive.company_supplier_rows.find((r) => r.company_id === companyId);
    if (row) return getSupplier(row.supplier_id);
  }
  const ingredient = getIngredient(ingredientId);
  if (ingredient && ingredient.supplier_ids.length > 0) {
    return getSupplier(ingredient.supplier_ids[0]);
  }
  return undefined;
}

export function getSubstitutionCandidatesForIngredient(ingredientId: string): SubstitutionProposal[] {
  return SUBSTITUTION_PROPOSALS.filter(
    (s) => s.from_ingredient_id === ingredientId || s.to_ingredient_id === ingredientId
  );
}
