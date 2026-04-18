"use client"
import { sharedCompanies, sharedSkus } from "@/lib/opportunity-metrics"
import { OPPORTUNITIES, type Opportunity } from "@/lib/demo-data"

interface AgentInsightProps {
  opportunity: Opportunity
}

interface InsightItem {
  text: string
  kind: "dependency" | "downstream"
}

function buildInsights(opp: Opportunity): InsightItem[] {
  const insights: InsightItem[] = []
  const others = OPPORTUNITIES.filter((o) => o.id !== opp.id)

  others.forEach((other) => {
    const cos = sharedCompanies(opp, other)
    const skus = sharedSkus(opp, other)
    if (cos.length >= 2 || skus.length >= 2) {
      insights.push({
        kind: "dependency",
        text: `Shares ${cos.length} compan${cos.length === 1 ? "y" : "ies"} and ${skus.length} SKU${skus.length === 1 ? "" : "s"} with "${other.headline}" — consider sequencing these together to consolidate supplier negotiations.`,
      })
    }
  })

  // Downstream precedent: if this is the highest-ranked consolidation
  if (opp.kind === "consolidate" && opp.fragmentation_score >= 80) {
    const relatedCount = others.filter((o) => sharedCompanies(opp, o).length >= 2).length
    if (relatedCount > 0) {
      insights.push({
        kind: "downstream",
        text: `Executing this first establishes a supplier-coordination precedent that reduces friction for ${relatedCount} other opportunit${relatedCount === 1 ? "y" : "ies"} sharing portfolio companies.`,
      })
    }
  }

  return insights
}

export function AgentInsight({ opportunity }: AgentInsightProps) {
  const insights = buildInsights(opportunity)
  if (insights.length === 0) return null

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lg" aria-hidden>🤖</span>
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">Agent analysis</span>
          <ul className="mt-2 space-y-2">
            {insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 shrink-0 text-primary">
                  {insight.kind === "dependency" ? "⇄" : "→"}
                </span>
                <span className="text-muted-foreground">{insight.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
