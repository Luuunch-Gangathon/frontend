"use client"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { getPlanSummary, getRankedOpportunities } from "@/lib/opportunity-metrics"
import { AppShell } from "@/components/layout/app-shell"

function fmt(dollars: number): string {
  return dollars >= 1_000_000
    ? `$${(dollars / 1_000_000).toFixed(1)}M`
    : `$${Math.round(dollars / 1_000)}k`
}

export default function PlanPage() {
  const { items, remove, clear } = useCart()
  const summary = getPlanSummary(items)
  const ranked = getRankedOpportunities().filter(({ opp }) => items.includes(opp.id))

  if (items.length === 0) {
    return (
      <AppShell>
        <div className="mt-20 text-center">
          <p className="text-muted-foreground">Your action plan is empty.</p>
          <p className="mt-1 text-sm text-muted-foreground">Add opportunities from the portfolio view.</p>
          <Link href="/" className="mt-4 inline-block text-sm underline">
            Go to portfolio
          </Link>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mb-2">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← Back to portfolio
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-1">Action plan</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {items.length} opportunit{items.length === 1 ? "y" : "ies"} selected
      </p>

      {/* Cumulative impact */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        {[
          { label: "Total savings / revenue", value: fmt(summary.totalSavings) },
          { label: "Companies affected", value: summary.companiesCount },
          { label: "Unique SKUs", value: summary.skusCount },
          { label: "Max timeline", value: `${summary.maxTimelineWeeks}w` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xl font-bold">{value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Conflict warnings */}
      {summary.conflicts.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-5">
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
            ⚠ SKU conflicts detected
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-400 mb-2">
            The following SKUs appear in multiple opportunities. Review rollout plans for sequencing conflicts.
          </p>
          <ul className="space-y-1">
            {summary.conflicts.map(({ sku, oppIds }) => (
              <li key={sku} className="text-xs text-amber-900 dark:text-amber-200">
                <code className="font-mono font-medium">{sku}</code> — appears in {oppIds.length} selected opportunities
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested execution order */}
      <div className="mb-6">
        <h2 className="text-base font-semibold mb-3">Suggested execution order</h2>
        <ol className="space-y-3">
          {ranked.map(({ opp, score, timelineWeeks }, idx) => (
            <li key={opp.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/opportunities/${opp.id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {opp.headline}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {opp.estimated_impact} · {opp.companies_involved.length} companies · {timelineWeeks}w timeline
                </p>
              </div>
              <button
                onClick={() => remove(opp.id)}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-3">
        <button
          onClick={clear}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Clear plan
        </button>
      </div>
    </AppShell>
  )
}
