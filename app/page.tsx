import { getPortfolioStats, getOpportunities, getCompany } from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { OpportunityCard } from "@/components/blocks/opportunity-card"
import { RecommendedSequence } from "@/components/blocks/recommended-sequence"
import { PortfolioCharts } from "@/components/blocks/portfolio-charts"
import { CompareFloat } from "@/components/blocks/compare-float"

export default function Home() {
  const stats = getPortfolioStats()
  const opportunities = getOpportunities()

  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-semibold">Spherecast</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {stats.companies} portfolio companies · {stats.opportunities} open opportunities
        </p>
      </div>

      <StatsStrip
        className="mt-6"
        stats={[
          { label: "Portfolio companies", value: stats.companies },
          { label: "Finished goods", value: stats.products },
          { label: "Suppliers", value: stats.suppliers },
          { label: "Open opportunities", value: stats.opportunities },
        ]}
      />

      <RecommendedSequence />

      <PortfolioCharts />

      <h2 className="mt-10 text-lg font-semibold mb-4">All opportunities</h2>
      <div className="space-y-4">
        {opportunities.map((opp) => {
          const companies = opp.companies_involved
            .map((id) => getCompany(id))
            .filter((c): c is NonNullable<typeof c> => c != null)
          return <OpportunityCard key={opp.id} opportunity={opp} companies={companies} />
        })}
      </div>

      <CompareFloat />
    </AppShell>
  )
}
