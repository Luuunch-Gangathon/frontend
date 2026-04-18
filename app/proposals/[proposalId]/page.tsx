import { notFound } from "next/navigation"
import Link from "next/link"
import { getProposal, getProposals, getCompany, getSupplier, getRawMaterial, getDecision } from "@/lib/api"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Section } from "@/components/blocks/section"
import { FragmentationBadge } from "@/components/blocks/fragmentation-badge"
import { AggressiveToggle } from "@/components/blocks/aggressive-toggle"
import { DataTable } from "@/components/blocks/data-table"
import { EvidenceTrail } from "@/components/blocks/evidence-trail"
import { ComplianceChecklist } from "@/components/blocks/compliance-checklist"
import { AskAgnesDrawer } from "@/components/blocks/ask-agnes-drawer"
import { DecisionPanel } from "@/components/blocks/decision-panel"

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ proposalId: string }>
}) {
  const { proposalId } = await params
  const numericProposalId = parseInt(proposalId, 10)

  let proposal
  try {
    proposal = await getProposal(numericProposalId)
  } catch {
    notFound()
  }

  const [rawMaterial, allProposals, companies, currentSuppliers, existingDecision] = await Promise.all([
    getRawMaterial(proposal.raw_material_id).catch(() => null),
    getProposals(),
    Promise.all(
      proposal.companies_involved.map((id) => getCompany(id).catch(() => null))
    ),
    Promise.all(
      proposal.current_suppliers.map((id) => getSupplier(id).catch(() => null))
    ),
    getDecision(numericProposalId).catch(() => null),
  ])

  const validCompanies = companies.filter((c): c is NonNullable<typeof c> => c != null)
  const validSuppliers = currentSuppliers.filter((s): s is NonNullable<typeof s> => s != null)

  const sortedProposals = allProposals
  const currentIdx = sortedProposals.findIndex((o) => o.id === numericProposalId)
  const isLast = currentIdx === sortedProposals.length - 1
  const nextHref = isLast ? "/" : `/proposals/${sortedProposals[currentIdx + 1].id}`
  const nextLabel = isLast ? "Back to proposals" : "Next proposal"

  const kindCls = proposal.kind === "optimization"
    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Proposals", href: "/" },
          { label: proposal.headline },
        ]}
      />

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${kindCls}`}>
            {proposal.kind === "optimization" ? "Optimization" : "Substitution"}
          </span>
          <FragmentationBadge score={proposal.fragmentation_score} />
        </div>
        <h1 className="text-2xl font-semibold">{proposal.headline}</h1>
        <p className="mt-2 text-muted-foreground">{proposal.summary}</p>
      </div>

      <Section title="The problem">
        <div className="rounded-lg border border-border bg-card p-5 space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-muted-foreground w-32 shrink-0">Raw material</span>
            <code className="font-mono font-medium">{rawMaterial?.sku}</code>
            <Link href={`/raw-materials/${proposal.raw_material_id}`} className="text-xs text-muted-foreground underline hover:text-foreground">
              view detail →
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-muted-foreground w-32 shrink-0">Companies affected</span>
            <strong>{validCompanies.length}</strong>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-muted-foreground w-32 shrink-0">Current suppliers</span>
            <span>
              <strong>{validSuppliers.length}</strong>
              <span className="ml-2 text-muted-foreground">{validSuppliers.map((s) => s.name).join(", ")}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-muted-foreground w-32 shrink-0">Fragmentation</span>
            <FragmentationBadge score={proposal.fragmentation_score} />
          </div>
        </div>
      </Section>

      <Section title="Companies involved">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {validCompanies.map((c) => (
            <Link
              key={c.id}
              href={`/companies/${c.id}`}
              className="rounded-lg border border-border bg-card p-4 hover:bg-muted transition-colors"
            >
              <div className="text-sm font-medium">{c.name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Portfolio company</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Proposed action">
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-5">
          <p className="text-sm font-medium">{proposal.proposed_action}</p>
        </div>
      </Section>

      {proposal.compliance_requirements?.length > 0 && (
        <Section title="Compliance">
          <ComplianceChecklist items={proposal.compliance_requirements} />
        </Section>
      )}

      <Section title="Tradeoffs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30 p-4">
            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3">Gained</h3>
            <ul className="space-y-2">
              {proposal.tradeoffs.gained.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-900 dark:text-emerald-200">
                  <span className="mt-0.5 shrink-0 text-emerald-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 p-4">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">At risk</h3>
            <ul className="space-y-2">
              {proposal.tradeoffs.atRisk.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
                  <span className="mt-0.5 shrink-0 text-amber-600">⚠</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Rollout plan">
        <AggressiveToggle
          nonAggressive={
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{proposal.conservative.timeline}</p>
              <DataTable
                columns={[{
                  key: "sku",
                  label: "Affected SKU",
                  render: (sku: string) => <code className="font-mono text-xs">{sku}</code>,
                }]}
                rows={proposal.conservative.affected_skus}
              />
            </div>
          }
          aggressive={
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{proposal.aggressive.timeline}</p>
              <DataTable
                columns={[{
                  key: "sku",
                  label: "Affected SKU",
                  render: (sku: string) => <code className="font-mono text-xs">{sku}</code>,
                }]}
                rows={proposal.aggressive.affected_skus}
              />
            </div>
          }
        />
      </Section>

      <section id="evidence" className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Evidence</h2>
        <EvidenceTrail items={proposal.evidence} />
      </section>

      <Section title="Your decision">
        <DecisionPanel proposalId={numericProposalId} initialDecision={existingDecision} />
      </Section>

      <div className="mt-16 flex justify-end border-t border-border pt-6">
        <Link
          href={nextHref}
          className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {nextLabel} →
        </Link>
      </div>

      <AskAgnesDrawer proposalId={numericProposalId} proposalHeadline={proposal.headline} />
    </AppShell>
  )
}
