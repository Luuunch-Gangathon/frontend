import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getProduct,
  getCompany,
  getIngredient,
  getSupplierForCompanyIngredient,
  getSubstitutionCandidatesForIngredient,
  getConsolidationFor,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { ZoneSection } from "@/components/blocks/zone-section"
import { DataTable } from "@/components/blocks/data-table"
import { ComplianceBadge } from "@/components/blocks/compliance-badge"
import { PitchCard } from "@/components/blocks/pitch-card"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = getProduct(productId)
  if (!product) notFound()

  const company = getCompany(product.company_id)!
  const ingredients = product.ingredient_ids.map((id) => getIngredient(id)).filter((x): x is NonNullable<typeof x> => x != null)

  const swappableCount = ingredients.filter(
    (i) => getSubstitutionCandidatesForIngredient(i.id).length > 0
  ).length

  const consolidationCount = ingredients.filter(
    (i) => getConsolidationFor(i.id) !== undefined
  ).length

  const topActions: { ingredientId: string; type: "consolidate" | "substitute" }[] = []
  for (const ing of ingredients) {
    if (topActions.length >= 2) break
    if (getConsolidationFor(ing.id)) topActions.push({ ingredientId: ing.id, type: "consolidate" })
    else if (getSubstitutionCandidatesForIngredient(ing.id).length > 0)
      topActions.push({ ingredientId: ing.id, type: "substitute" })
  }

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Spherecast", href: "/" },
          { label: company.name, href: `/companies/${company.id}` },
          { label: product.name },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Link
            href={`/companies/${company.id}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {company.name}
          </Link>
          {product.compliance_tags.map((tag) => (
            <ComplianceBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      <StatsStrip
        className="mt-6"
        stats={[
          { label: "Ingredients", value: ingredients.length },
          { label: "Swappable ingredients", value: swappableCount },
          { label: "Consolidation candidates", value: consolidationCount },
          { label: "Compliance tags", value: product.compliance_tags.length },
        ]}
      />

      <ZoneSection zone={1} title="Bill of materials">
        <DataTable
          columns={[
            { key: "name", label: "Ingredient", render: (i) => i.canonical_name },
            {
              key: "supplier",
              label: "Current supplier",
              render: (i) => {
                const s = getSupplierForCompanyIngredient(product.company_id, i.id)
                return s ? s.name : <span className="text-muted-foreground">—</span>
              },
            },
            {
              key: "subs",
              label: "Substitution candidates",
              render: (i) => {
                const count = getSubstitutionCandidatesForIngredient(i.id).length
                return count > 0 ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">{count}</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )
              },
            },
            {
              key: "category",
              label: "Category",
              render: (i) => (
                <span className="text-sm text-muted-foreground">{i.category}</span>
              ),
            },
          ]}
          rows={ingredients}
          getRowHref={(i) => `/ingredients/${i.id}`}
        />
      </ZoneSection>

      <ZoneSection zone={2} title="Flags">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4 text-sm">
            <div className="text-2xl font-semibold">{swappableCount}</div>
            <div className="mt-0.5 text-muted-foreground">
              ingredient{swappableCount !== 1 ? "s" : ""} with substitution candidates
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-sm">
            <div className="text-2xl font-semibold">{consolidationCount}</div>
            <div className="mt-0.5 text-muted-foreground">
              ingredient{consolidationCount !== 1 ? "s" : ""} in portfolio consolidation groups
            </div>
          </div>
        </div>
      </ZoneSection>

      {topActions.length > 0 && (
        <ZoneSection zone={3} title="Recommended actions">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {topActions.map(({ ingredientId, type }) => {
              const ing = getIngredient(ingredientId)!
              return (
                <PitchCard
                  key={ingredientId}
                  headline={
                    type === "consolidate"
                      ? `Consolidate ${ing.canonical_name} suppliers`
                      : `Substitute ${ing.canonical_name}`
                  }
                  bullets={
                    type === "consolidate"
                      ? [
                          "Multiple portfolio companies share this ingredient",
                          "Consolidating suppliers can reduce cost 10–18%",
                          "Unified CoA reduces QA overhead",
                        ]
                      : [
                          "A functionally equivalent alternative exists",
                          "May improve allergen profile or certifications",
                          "Validated formulation pathway available",
                        ]
                  }
                  actions={[
                    {
                      label: type === "consolidate" ? "View consolidation pitch" : "View substitution pitch",
                      href:
                        type === "consolidate"
                          ? `/ingredients/${ingredientId}/consolidate`
                          : `/ingredients/${ingredientId}/substitute`,
                    },
                    {
                      label: `View ${ing.canonical_name}`,
                      href: `/ingredients/${ingredientId}`,
                      variant: "secondary",
                    },
                  ]}
                />
              )
            })}
          </div>
        </ZoneSection>
      )}
    </AppShell>
  )
}
