import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getIngredient,
  getSupplier,
  getCompaniesUsingIngredient,
  getProductsUsingIngredient,
  getConsolidationFor,
  getSubstitutionCandidatesForIngredient,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ZoneSection } from "@/components/blocks/zone-section"
import { DataTable } from "@/components/blocks/data-table"
import { FragmentationBadge } from "@/components/blocks/fragmentation-badge"
import { ComplianceBadge } from "@/components/blocks/compliance-badge"
import { PitchCard } from "@/components/blocks/pitch-card"

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ ingredientId: string }>
}) {
  const { ingredientId } = await params
  const ingredient = getIngredient(ingredientId)
  if (!ingredient) notFound()

  const suppliers = ingredient.supplier_ids.map((id) => getSupplier(id)).filter((x): x is NonNullable<typeof x> => x != null)
  const companiesUsing = getCompaniesUsingIngredient(ingredientId)
  const productsUsing = getProductsUsingIngredient(ingredientId)
  const consolidation = getConsolidationFor(ingredientId)
  const substitutions = getSubstitutionCandidatesForIngredient(ingredientId)

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Spherecast", href: "/" },
          { label: ingredient.canonical_name },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">{ingredient.canonical_name}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Raw name: <code className="font-mono text-xs">{ingredient.raw_name}</code></span>
          <span>·</span>
          <span>{ingredient.category}</span>
          {ingredient.allergen_tags.length > 0 && (
            <>
              <span>·</span>
              {ingredient.allergen_tags.map((tag) => (
                <ComplianceBadge key={tag} tag={`Allergen: ${tag}`} status="warn" />
              ))}
            </>
          )}
        </div>
      </div>

      <ZoneSection zone={1} title="Used by">
        <DataTable
          columns={[
            {
              key: "company",
              label: "Company",
              render: (p) => {
                const company = companiesUsing.find((c) => c.id === p.company_id)
                return company ? (
                  <Link href={`/companies/${company.id}`} className="hover:underline font-medium">
                    {company.name}
                  </Link>
                ) : (
                  "—"
                )
              },
            },
            { key: "product", label: "Product", render: (p) => p.name },
            {
              key: "compliance",
              label: "Compliance",
              render: (p) => (
                <div className="flex flex-wrap gap-1">
                  {p.compliance_tags.map((tag) => (
                    <ComplianceBadge key={tag} tag={tag} />
                  ))}
                </div>
              ),
            },
          ]}
          rows={productsUsing}
          getRowHref={(p) => `/products/${p.id}`}
        />
      </ZoneSection>

      <ZoneSection zone={1} title="Current suppliers">
        <DataTable
          columns={[
            { key: "name", label: "Supplier", render: (s) => s.name },
            {
              key: "certs",
              label: "Certifications",
              render: (s) => (
                <div className="flex flex-wrap gap-1">
                  {s.certifications.map((c) => (
                    <ComplianceBadge key={c} tag={c} />
                  ))}
                </div>
              ),
            },
            {
              key: "fragmentation",
              label: "Fragmentation",
              render: () =>
                consolidation ? (
                  <FragmentationBadge score={consolidation.fragmentation_score} />
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                ),
            },
          ]}
          rows={suppliers}
        />
      </ZoneSection>

      <ZoneSection zone={1} title="Certifications & compliance matrix">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Supplier</th>
                {["USP", "GMP", "Halal", "Kosher", "Non-GMO", "NSF", "Organic"].map((cert) => (
                  <th key={cert} className="px-3 py-2.5 text-center font-medium text-muted-foreground text-xs">
                    {cert}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium">{s.name}</td>
                  {["USP", "GMP", "Halal", "Kosher", "Non-GMO", "NSF", "Organic"].map((cert) => (
                    <td key={cert} className="px-3 py-2.5 text-center">
                      {s.certifications.some((c) => c.toLowerCase().includes(cert.toLowerCase())) ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓</span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ZoneSection>

      {substitutions.length > 0 && (
        <ZoneSection zone={2} title="Substitution candidates">
          <DataTable
            columns={[
              {
                key: "to",
                label: "Substitute",
                render: (s) => {
                  const targetId = s.from_ingredient_id === ingredientId ? s.to_ingredient_id : s.from_ingredient_id
                  const target = getIngredient(targetId)
                  return target ? (
                    <Link href={`/ingredients/${target.id}`} className="hover:underline font-medium">
                      {target.canonical_name}
                    </Link>
                  ) : targetId
                },
              },
              {
                key: "confidence",
                label: "Equivalence confidence",
                render: (s) => (
                  <span className="font-medium">
                    {s.equivalence_confidence}%
                  </span>
                ),
              },
              {
                key: "skus",
                label: "Affected SKUs",
                render: (s) => s.affected_skus.length,
              },
              {
                key: "compliance",
                label: "Compliance delta",
                render: (s) => (
                  <span className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
                    {s.compliance_delta.slice(0, 80)}…
                  </span>
                ),
              },
            ]}
            rows={substitutions}
            getRowHref={() => `/ingredients/${ingredientId}/substitute`}
          />
        </ZoneSection>
      )}

      <ZoneSection zone={3} title="Actions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {consolidation && (
            <PitchCard
              headline="Consolidate suppliers"
              bullets={[
                `${consolidation.companies.length} portfolio companies share this ingredient`,
                `${consolidation.current_suppliers.length} suppliers currently — fragmentation score ${consolidation.fragmentation_score}/100`,
                `Proposed: consolidate on ${getSupplier(consolidation.proposed_supplier_id)?.name}`,
              ]}
              actions={[
                { label: "View consolidation pitch", href: `/ingredients/${ingredientId}/consolidate` },
              ]}
            />
          )}
          {substitutions.length > 0 && (
            <PitchCard
              headline="Propose substitution"
              bullets={[
                `${substitutions.length} substitution candidate${substitutions.length !== 1 ? "s" : ""} identified`,
                `Top candidate: ${getIngredient(substitutions[0].to_ingredient_id)?.canonical_name ?? substitutions[0].to_ingredient_id}`,
                `Equivalence confidence: ${substitutions[0].equivalence_confidence}%`,
              ]}
              actions={[
                { label: "View substitution pitch", href: `/ingredients/${ingredientId}/substitute` },
              ]}
            />
          )}
        </div>
      </ZoneSection>
    </AppShell>
  )
}
