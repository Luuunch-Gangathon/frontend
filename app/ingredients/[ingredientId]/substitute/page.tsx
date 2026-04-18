import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getIngredient,
  getSubstitutionFor,
  getSupplier,
  getCompany,
  getProduct,
  SUBSTITUTION_EVIDENCE,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ZoneSection } from "@/components/blocks/zone-section"
import { AggressiveToggle } from "@/components/blocks/aggressive-toggle"
import { EvidenceTrail } from "@/components/blocks/evidence-trail"
import { ComplianceBadge } from "@/components/blocks/compliance-badge"

export default async function SubstitutePage({
  params,
}: {
  params: Promise<{ ingredientId: string }>
}) {
  const { ingredientId } = await params
  const ingredient = getIngredient(ingredientId)
  if (!ingredient) notFound()

  const proposal = getSubstitutionFor(ingredientId)
  if (!proposal) notFound()

  const toIngredient = getIngredient(proposal.to_ingredient_id)!
  const toSuppliers = toIngredient.supplier_ids.map((id) => getSupplier(id)).filter(Boolean) as NonNullable<ReturnType<typeof getSupplier>>[]
  const evidence = SUBSTITUTION_EVIDENCE[ingredientId] ?? []

  const affectedProductsByCompany = proposal.affected_skus.reduce<Record<string, string[]>>(
    (acc, skuId) => {
      const product = getProduct(skuId)
      if (!product) return acc
      const company = getCompany(product.company_id)
      const key = company?.name ?? product.company_id
      acc[key] = [...(acc[key] ?? []), product.name]
      return acc
    },
    {}
  )

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Spherecast", href: "/" },
          { label: ingredient.canonical_name, href: `/ingredients/${ingredientId}` },
          { label: "Top Substitutions" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">
          Substitute {ingredient.canonical_name} → {toIngredient.canonical_name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {proposal.equivalence_confidence}% equivalence confidence · {proposal.affected_skus.length} affected SKUs
        </p>
      </div>

      <ZoneSection zone={1} title="Substitution proposal">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">From</p>
            <Link href={`/ingredients/${ingredient.id}`} className="font-semibold hover:underline">
              {ingredient.canonical_name}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">{ingredient.category}</p>
            {ingredient.allergen_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {ingredient.allergen_tags.map((tag) => (
                  <ComplianceBadge key={tag} tag={`Allergen: ${tag}`} status="warn" />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-lg border border-primary/30 bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">To</p>
            <Link href={`/ingredients/${toIngredient.id}`} className="font-semibold hover:underline">
              {toIngredient.canonical_name}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">{toIngredient.category}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {toSuppliers.map((s) => (
                <span key={s.id} className="text-xs text-muted-foreground">{s.name}</span>
              ))}
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {proposal.equivalence_confidence}% confidence
              </span>
            </div>
          </div>
        </div>
      </ZoneSection>

      <ZoneSection zone={1} title="Functional equivalence reasoning">
        <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground leading-relaxed">
          {proposal.equivalence_reasoning}
        </div>
      </ZoneSection>

      <ZoneSection zone={2} title="Compliance delta">
        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 text-sm text-emerald-800 dark:text-emerald-300">
          {proposal.compliance_delta}
        </div>
      </ZoneSection>

      <ZoneSection zone={2} title="Affected SKUs by company">
        <div className="space-y-3">
          {Object.entries(affectedProductsByCompany).map(([companyName, products]) => (
            <div key={companyName} className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold mb-2">{companyName}</h3>
              <ul className="space-y-1">
                {products.map((name) => (
                  <li key={name} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ZoneSection>

      <ZoneSection zone={3} title="Implementation plan">
        <AggressiveToggle
          nonAggressive={
            <SubModePanel
              affectedSkus={proposal.nonAggressive.affected_skus}
              timeline={proposal.nonAggressive.timeline}
              backupSupplier={
                proposal.nonAggressive.backup_supplier_id
                  ? getSupplier(proposal.nonAggressive.backup_supplier_id)?.name
                  : undefined
              }
            />
          }
          aggressive={
            <SubModePanel
              affectedSkus={proposal.aggressive.affected_skus}
              timeline={proposal.aggressive.timeline}
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

function SubModePanel({
  affectedSkus,
  timeline,
  backupSupplier,
}: {
  affectedSkus: string[]
  timeline: string
  backupSupplier?: string
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card px-4 py-3">
          <div className="text-2xl font-semibold tabular-nums">{affectedSkus.length}</div>
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

      <div className="rounded-lg border border-border bg-card p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">SKUs in scope</h4>
        <ul className="space-y-1">
          {affectedSkus.map((skuId) => {
            const p = getProduct(skuId)
            const c = p ? getCompany(p.company_id) : undefined
            return (
              <li key={skuId} className="text-sm flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {p ? (
                  <Link href={`/products/${p.id}`} className="hover:underline">
                    {p.name}
                    {c && <span className="text-muted-foreground ml-1">({c.name})</span>}
                  </Link>
                ) : (
                  skuId
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
