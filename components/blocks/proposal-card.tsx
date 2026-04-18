import Link from "next/link"
import { CompanyBadge } from "@/components/blocks/company-badge"
import { FragmentationBadge } from "@/components/blocks/fragmentation-badge"
import type { Proposal, Company } from "@/lib/types"

interface ProposalCardProps {
  proposal: Proposal
  companies: Company[]
}

export function ProposalCard({ proposal, companies }: ProposalCardProps) {
  const kindCls = proposal.kind === "optimization"
    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${kindCls}`}>
          {proposal.kind === "optimization" ? "Optimization" : "Substitution"}
        </span>
        <FragmentationBadge score={proposal.fragmentation_score} />
      </div>
      <h3 className="text-base font-semibold">{proposal.headline}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{proposal.summary}</p>
      <p className="mt-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {proposal.estimated_impact}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {companies.map((c) => (
          <CompanyBadge key={c.id} id={c.id} name={c.name} />
        ))}
      </div>
      <div className="mt-4">
        <Link
          href={`/proposals/${proposal.id}`}
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Review proposal →
        </Link>
      </div>
    </div>
  )
}
