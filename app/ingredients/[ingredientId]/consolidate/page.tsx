import { notFound } from "next/navigation"
import {
  getIngredient,
  getConsolidationFor,
  getSupplier,
  getCompany,
  CONSOLIDATION_EVIDENCE,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ZoneSection } from "@/components/blocks/zone-section"
import { AggressiveToggle } from "@/components/blocks/aggressive-toggle"
import { EvidenceTrail } from "@/components/blocks/evidence-trail"
import { FragmentationBadge } from "@/components/blocks/fragmentation-badge"
import { ComplianceBadge } from "@/components/blocks/compliance-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function ConsolidatePage({
  params,
}: {
  params: Promise<{ ingredientId: string }>
}) {
  const { ingredientId } = await params
  const ingredient = getIngredient(ingredientId)
  if (!ingredient) notFound()

  const consolidation = getConsolidationFor(ingredientId)
  if (!consolidation) notFound()

  const proposedSupplier = getSupplier(consolidation.proposed_supplier_id)!
  const currentSuppliers = consolidation.current_suppliers.map((id) => getSupplier(id)).filter((x): x is NonNullable<typeof x> => x != null)
  const evidence = CONSOLIDATION_EVIDENCE[ingredientId] ?? []

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Spherecast", href: "/" },
          { label: ingredient.canonical_name, href: `/ingredients/${ingredientId}` },
          { label: "Supplier Consolidation" },
        ]}
      />

      <div className="mt-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">
            Consolidate {ingredient.canonical_name} → {proposedSupplier.name}
          </h1>
          <FragmentationBadge score={consolidation.fragmentation_score} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {consolidation.companies.length} portfolio companies · {consolidation.current_suppliers.length} current suppliers
        </p>
      </div>

      <ZoneSection zone={1} title="Current state">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Companies using this ingredient
            </h3>
            <ul className="space-y-1">
              {consolidation.companies.map((cId) => {
                const c = getCompany(cId)
                return (
                  <li key={cId} className="text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {c?.name ?? cId}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Current suppliers ({currentSuppliers.length})
            </h3>
            <ul className="space-y-2">
              {currentSuppliers.map((s) => (
                <li key={s.id} className="text-sm">
                  <div className="font-medium">{s.name}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {s.certifications.map((c) => (
                      <ComplianceBadge key={c} tag={c} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ZoneSection>

      <ZoneSection zone={1} title="Proposed state">
        <div className="rounded-lg border border-primary/30 bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{proposedSupplier.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Proposed consolidated supplier</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {proposedSupplier.certifications.map((c) => (
                  <ComplianceBadge key={c} tag={c} />
                ))}
              </div>
            </div>
          </div>
          <ul className="mt-4 space-y-1">
            {consolidation.tradeoffs.gained.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <span className="mt-1 shrink-0">+</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </ZoneSection>

      <ZoneSection zone={2} title="Tradeoffs">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">Gained</h3>
            <ul className="space-y-1.5">
              {consolidation.tradeoffs.gained.map((g, i) => (
                <li key={i} className="text-sm text-emerald-700 dark:text-emerald-400 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">✓</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">At risk</h3>
            <ul className="space-y-1.5">
              {consolidation.tradeoffs.atRisk.map((r, i) => (
                <li key={i} className="text-sm text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">△</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ZoneSection>

      <ZoneSection zone={3} title="Implementation plan">
        <AggressiveToggle
          nonAggressive={
            <ModePanel
              label="Conservative"
              affectedSkus={consolidation.nonAggressive.affected_skus}
              timeline={consolidation.nonAggressive.timeline}
              backupSupplier={consolidation.nonAggressive.backup_supplier_id ? getSupplier(consolidation.nonAggressive.backup_supplier_id)?.name : undefined}
              rows={consolidation.nonAggressive.company_supplier_rows}
            />
          }
          aggressive={
            <ModePanel
              label="Aggressive"
              affectedSkus={consolidation.aggressive.affected_skus}
              timeline={consolidation.aggressive.timeline}
              rows={consolidation.aggressive.company_supplier_rows}
            />
          }
        />
      </ZoneSection>

      {evidence.length > 0 && (
        <ZoneSection zone={3} title="Evidence trail">
          <EvidenceTrail items={evidence} />
        </ZoneSection>
      )}
    </AppShell>
  )
}

function ModePanel({
  label,
  affectedSkus,
  timeline,
  backupSupplier,
  rows,
}: {
  label: string
  affectedSkus: number
  timeline: string
  backupSupplier?: string
  rows: { company_id: string; supplier_id: string }[]
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="text-2xl font-semibold tabular-nums">{affectedSkus}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Affected SKUs</div>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-3 sm:col-span-2">
          <div className="text-sm font-medium">{timeline}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Timeline</div>
        </div>
      </div>

      {backupSupplier && (
        <p className="text-sm text-muted-foreground">
          Backup supplier: <strong>{backupSupplier}</strong>
        </p>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Assigned supplier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const company = getCompany(row.company_id)
              const supplier = getSupplier(row.supplier_id)
              return (
                <TableRow key={row.company_id}>
                  <TableCell className="font-medium">{company?.name ?? row.company_id}</TableCell>
                  <TableCell>{supplier?.name ?? row.supplier_id}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
