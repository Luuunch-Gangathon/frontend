"use client"
import type { ReactNode } from "react"
import Link from "next/link"
import { sharedCompanies, sharedSkus, parseSavingsUsd, parseTimelineWeeks } from "@/lib/opportunity-metrics"
import { getCompany } from "@/lib/demo-data"
import type { Opportunity } from "@/lib/demo-data"

interface CompareTableProps {
  opportunities: Opportunity[]
}

function riskLevel(opp: Opportunity): string {
  const atRiskCount = opp.tradeoffs.atRisk.length
  if (atRiskCount >= 3) return "High"
  if (atRiskCount === 2) return "Medium"
  return "Low"
}

const RISK_CLS: Record<string, string> = {
  High: "text-red-600 dark:text-red-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-emerald-600 dark:text-emerald-400",
}

export function CompareTable({ opportunities }: CompareTableProps) {
  const rows: Array<{
    label: string
    values: (opp: Opportunity) => ReactNode
  }> = [
    {
      label: "Kind",
      values: (o) => (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          o.kind === "consolidate"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
        }`}>
          {o.kind === "consolidate" ? "Consolidate" : "Substitute"}
        </span>
      ),
    },
    {
      label: "Estimated impact",
      values: (o) => <span className="font-semibold text-emerald-700 dark:text-emerald-400">{o.estimated_impact}</span>,
    },
    {
      label: "Savings (midpoint)",
      values: (o) => {
        const v = parseSavingsUsd(o.estimated_impact)
        return v >= 1_000_000
          ? `$${(v / 1_000_000).toFixed(1)}M`
          : `$${Math.round(v / 1_000)}k`
      },
    },
    {
      label: "Conservative timeline",
      values: (o) => `${parseTimelineWeeks(o.conservative.timeline)} weeks`,
    },
    {
      label: "Companies affected",
      values: (o) => o.companies_involved.length,
    },
    {
      label: "SKUs (conservative)",
      values: (o) => o.conservative.affected_skus.length,
    },
    {
      label: "SKUs (aggressive)",
      values: (o) => o.aggressive.affected_skus.length,
    },
    {
      label: "Current suppliers",
      values: (o) => o.current_suppliers.length,
    },
    {
      label: "Fragmentation score",
      values: (o) => <span className="font-semibold">{o.fragmentation_score}</span>,
    },
    {
      label: "Risk level",
      values: (o) => {
        const r = riskLevel(o)
        return <span className={`font-medium ${RISK_CLS[r]}`}>{r}</span>
      },
    },
  ]

  // Overlap strip — only for pairs
  const overlapPairs: Array<{ labelA: string; labelB: string; companies: string[]; skus: string[] }> = []
  for (let i = 0; i < opportunities.length; i++) {
    for (let j = i + 1; j < opportunities.length; j++) {
      const a = opportunities[i]
      const b = opportunities[j]
      const cos = sharedCompanies(a, b)
      const skus = sharedSkus(a, b)
      if (cos.length > 0 || skus.length > 0) {
        overlapPairs.push({
          labelA: a.headline.split(" ").slice(0, 4).join(" "),
          labelB: b.headline.split(" ").slice(0, 4).join(" "),
          companies: cos.map((id) => getCompany(id)?.name ?? id),
          skus,
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-40">Metric</th>
              {opportunities.map((opp) => (
                <th key={opp.id} className="px-4 py-3 text-left font-semibold">
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="hover:underline line-clamp-2 block text-sm leading-tight"
                  >
                    {opp.headline}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/50 hover:bg-muted/20">
                <td className="px-4 py-2.5 text-muted-foreground text-xs font-medium">{row.label}</td>
                {opportunities.map((opp) => (
                  <td key={opp.id} className="px-4 py-2.5">
                    {row.values(opp)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {overlapPairs.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-5">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">Overlap between selected opportunities</h3>
          {overlapPairs.map((pair, i) => (
            <div key={i} className="mb-3 last:mb-0">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-1">
                &ldquo;{pair.labelA}&rdquo; ↔ &ldquo;{pair.labelB}&rdquo;
              </p>
              {pair.companies.length > 0 && (
                <p className="text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-medium">Shared companies ({pair.companies.length}):</span>{" "}
                  {pair.companies.join(", ")}
                </p>
              )}
              {pair.skus.length > 0 && (
                <p className="text-xs text-amber-900 dark:text-amber-200 mt-0.5">
                  <span className="font-medium">Shared SKUs ({pair.skus.length}):</span>{" "}
                  <code className="font-mono">{pair.skus.join(", ")}</code>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
