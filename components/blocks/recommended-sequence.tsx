"use client"
import { useState } from "react"
import Link from "next/link"
import { getRankedOpportunities, parseSavingsUsd, parseTimelineWeeks } from "@/lib/opportunity-metrics"

const RANK_RATIONALE: Record<string, (score: number, companies: number, weeks: number, savings: number) => string> = {
  "opp-consolidate-mag-stearate": (score, companies, weeks, savings) =>
    `Highest leverage score (${score.toFixed(1)}): fragmentation score 87 × ${companies} companies ÷ ${weeks}w timeline. Unlocks $${Math.round(savings / 1000)}k/yr — start here to establish supplier-coordination precedent.`,
  "opp-consolidate-mcc-ph101": (score, companies, weeks, savings) =>
    `Score ${score.toFixed(1)}: ${companies} companies already on a single supplier — formalizing an MSA is low-friction with a short ${weeks}w runway. Builds on momentum from mag-stearate.`,
  "opp-substitute-soy-lecithin": (score, companies, weeks, savings) =>
    `Score ${score.toFixed(1)}: highest revenue upside ($${(savings / 1_000_000).toFixed(1)}M) but longer ${weeks}w pilot phase and only ${companies} companies. Sequence last — validate formulation while earlier consolidations execute.`,
}

const DEFAULT_RATIONALE = (score: number, companies: number, weeks: number) =>
  `Score ${score.toFixed(1)}: ${companies} companies × fragmentation ÷ ${weeks}w timeline.`

export function RecommendedSequence() {
  const [expanded, setExpanded] = useState(false)
  const ranked = getRankedOpportunities()

  return (
    <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lg" aria-hidden>🤖</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">Agent analysis</span>
          </div>
          <h2 className="text-base font-semibold mb-3">Recommended execution sequence</h2>
          <ol className="space-y-3">
            {ranked.map(({ opp, score, savingsUsd, timelineWeeks }, idx) => {
              const rationale = RANK_RATIONALE[opp.id]
                ? RANK_RATIONALE[opp.id](score, opp.companies_involved.length, timelineWeeks, savingsUsd)
                : DEFAULT_RATIONALE(score, opp.companies_involved.length, timelineWeeks)
              return (
                <li key={opp.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="text-sm font-semibold hover:underline"
                    >
                      {opp.headline}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{rationale}</p>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="mt-4">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              {expanded ? "Hide formula ↑" : "How was this computed? ↓"}
            </button>
            {expanded && (
              <div className="mt-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-mono font-medium">score = fragmentation_score × companies_involved ÷ timeline_weeks</p>
                <p>timeline_weeks is parsed from the conservative rollout estimate.</p>
                <table className="mt-2 w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-left">
                      <th className="pr-4 pb-1 font-medium">Opportunity</th>
                      <th className="pr-4 pb-1 font-medium">Frag.</th>
                      <th className="pr-4 pb-1 font-medium">Cos.</th>
                      <th className="pr-4 pb-1 font-medium">Weeks</th>
                      <th className="pb-1 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map(({ opp, score, timelineWeeks }) => (
                      <tr key={opp.id}>
                        <td className="pr-4 py-0.5 text-muted-foreground">{opp.headline.split(" ").slice(0, 4).join(" ")}&hellip;</td>
                        <td className="pr-4 py-0.5">{opp.fragmentation_score}</td>
                        <td className="pr-4 py-0.5">{opp.companies_involved.length}</td>
                        <td className="pr-4 py-0.5">{timelineWeeks}</td>
                        <td className="py-0.5 font-medium">{score.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
