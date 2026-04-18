"use client"
import Link from "next/link"
import { CompanyBadge } from "@/components/blocks/company-badge"
import { FragmentationBadge } from "@/components/blocks/fragmentation-badge"
import { PlanCartButton } from "@/components/blocks/plan-cart-button"
import { useCompare } from "@/lib/compare-context"
import type { Opportunity, Company } from "@/lib/demo-data"

interface OpportunityCardProps {
  opportunity: Opportunity
  companies: Company[]
}

export function OpportunityCard({ opportunity, companies }: OpportunityCardProps) {
  const { selected, toggle } = useCompare()
  const isSelected = selected.includes(opportunity.id)
  const atMaxAndNotSelected = selected.length >= 3 && !isSelected

  const kindCls = opportunity.kind === "consolidate"
    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"

  return (
    <div className={`rounded-xl border bg-card p-6 transition-colors ${isSelected ? "border-primary/50 bg-primary/5" : "border-border"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${kindCls}`}>
            {opportunity.kind === "consolidate" ? "Consolidate" : "Substitute"}
          </span>
          <FragmentationBadge score={opportunity.fragmentation_score} />
        </div>
        <label
          className="flex items-center gap-1.5 cursor-pointer shrink-0 mt-0.5"
          title={atMaxAndNotSelected ? "Max 3 opportunities can be compared" : "Select to compare"}
        >
          <input
            type="checkbox"
            checked={isSelected}
            disabled={atMaxAndNotSelected}
            onChange={() => toggle(opportunity.id)}
            className="h-4 w-4 rounded border-border accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          />
          <span className="text-xs text-muted-foreground select-none">Compare</span>
        </label>
      </div>
      <h3 className="text-base font-semibold">{opportunity.headline}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{opportunity.summary}</p>
      <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {opportunity.estimated_impact}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {companies.map((c) => (
          <CompanyBadge key={c.id} id={c.id} name={c.name} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Review opportunity →
        </Link>
        <PlanCartButton opportunityId={opportunity.id} />
      </div>
    </div>
  )
}
