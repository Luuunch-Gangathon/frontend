import {
  getPortfolioStats,
  getTopConsolidationOpportunities,
  getTopSubstitutionOpportunities,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { ZoneSection } from "@/components/blocks/zone-section"
import { DataTable } from "@/components/blocks/data-table"
import { FragmentationBadge } from "@/components/blocks/fragmentation-badge"

export default function Home() {
  const stats = getPortfolioStats()
  const consolidationOpps = getTopConsolidationOpportunities()
  const substitutionOpps = getTopSubstitutionOpportunities()

  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-semibold">Spherecast</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Supply chain co-pilot across {stats.companies} portfolio companies
        </p>
      </div>

      <StatsStrip
        className="mt-6"
        stats={[
          { label: "Portfolio companies", value: stats.companies },
          { label: "Ingredients tracked", value: stats.ingredients },
          { label: "Suppliers", value: stats.suppliers },
          { label: "Open consolidation opps", value: stats.consolidationOpps },
        ]}
      />

      <ZoneSection zone={2} title="Top consolidation opportunities">
        <DataTable
          columns={[
            {
              key: "ingredient",
              label: "Ingredient",
              render: (row) => (
                <span className="font-medium">{row.ingredient.canonical_name}</span>
              ),
            },
            {
              key: "companies",
              label: "# Companies",
              render: (row) => row.companies,
            },
            {
              key: "suppliers",
              label: "# Suppliers",
              render: (row) => row.suppliers,
            },
            {
              key: "fragmentation",
              label: "Fragmentation",
              render: (row) => <FragmentationBadge score={row.fragmentation_score} />,
            },
            {
              key: "proposed",
              label: "Proposed supplier",
              render: (row) => (
                <span className="text-sm text-muted-foreground">{row.proposed_supplier.name}</span>
              ),
            },
          ]}
          rows={consolidationOpps}
          getRowHref={(row) => `/ingredients/${row.ingredient.id}/consolidate`}
        />
      </ZoneSection>

      <ZoneSection zone={2} title="Top substitution opportunities">
        <DataTable
          columns={[
            {
              key: "from",
              label: "Current ingredient",
              render: (row) => <span className="font-medium">{row.from.canonical_name}</span>,
            },
            {
              key: "to",
              label: "Proposed substitute",
              render: (row) => (
                <span className="text-sm">{row.to.canonical_name}</span>
              ),
            },
            {
              key: "skus",
              label: "# SKUs",
              render: (row) => row.affected_skus,
            },
            {
              key: "confidence",
              label: "Confidence",
              render: (row) => (
                <span className="font-medium">{row.confidence}%</span>
              ),
            },
            {
              key: "compliance",
              label: "Compliance delta",
              render: (row) => (
                <span className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
                  {row.compliance_delta.slice(0, 70)}…
                </span>
              ),
            },
          ]}
          rows={substitutionOpps}
          getRowHref={(row) => `/ingredients/${row.from.id}/substitute`}
        />
      </ZoneSection>

      <ZoneSection zone={3} title="Ask Agent">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 opacity-60">
          <input
            disabled
            placeholder="Ask about consolidation opportunities, compliance gaps, supplier risks…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground cursor-not-allowed"
          />
          <button
            disabled
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground opacity-50 cursor-not-allowed"
          >
            Ask
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Agent interface coming soon.</p>
      </ZoneSection>
    </AppShell>
  )
}
