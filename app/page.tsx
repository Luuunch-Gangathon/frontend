import { getProposals, getCompanies } from "@/lib/api"
import { AppShell } from "@/components/layout/app-shell"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { ProposalCard } from "@/components/blocks/proposal-card"

export default async function Home() {
  const [proposals, companies] = await Promise.all([getProposals(), getCompanies()])

  const companyMap = new Map(companies.map((c) => [c.id, c]))

  return (
    <AppShell>
      <div>
        <h1 className="text-2xl font-semibold">Proposals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {companies.length} portfolio companies · {proposals.length} open proposals
        </p>
      </div>

      <StatsStrip
        className="mt-6"
        stats={[
          { label: "Portfolio companies", value: companies.length },
          { label: "Open proposals", value: proposals.length },
        ]}
      />

      <div className="mt-10 space-y-4">
        {proposals.map((proposal) => {
          const proposalCompanies = proposal.companies_involved
            .map((id) => companyMap.get(id))
            .filter((c): c is NonNullable<typeof c> => c != null)
          return <ProposalCard key={proposal.id} proposal={proposal} companies={proposalCompanies} />
        })}
      </div>
    </AppShell>
  )
}
