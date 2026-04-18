import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getCompany,
  getProductsForCompany,
  getIngredient,
  getSupplier,
  getIngredientOverlapScore,
  getCompaniesUsingIngredient,
  getSupplierForCompanyIngredient,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { ZoneSection } from "@/components/blocks/zone-section"
import { DataTable } from "@/components/blocks/data-table"
import { ComplianceBadge } from "@/components/blocks/compliance-badge"

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params
  const company = getCompany(companyId)
  if (!company) notFound()

  const products = getProductsForCompany(companyId)
  const allIngredientIds = new Set(products.flatMap((p) => p.ingredient_ids))
  const ingredients = [...allIngredientIds].map((id) => getIngredient(id)).filter((x): x is NonNullable<typeof x> => x != null)
  const supplierIds = new Set(ingredients.flatMap((i) => i.supplier_ids))
  const { sharedWith, sharedIngredients } = getIngredientOverlapScore(companyId)

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Spherecast", href: "/" },
          { label: company.name },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">{company.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Portfolio company</p>
      </div>

      <StatsStrip
        className="mt-6"
        stats={[
          { label: "Products", value: products.length },
          { label: "Unique ingredients", value: allIngredientIds.size },
          { label: "Suppliers", value: supplierIds.size },
          { label: "Shared ingredients", value: sharedIngredients },
        ]}
      />

      <ZoneSection zone={1} title="Products">
        <DataTable
          columns={[
            { key: "name", label: "Product", render: (p) => p.name },
            {
              key: "ingredients",
              label: "Ingredients",
              render: (p) => p.ingredient_ids.length,
            },
            {
              key: "compliance",
              label: "Compliance tags",
              render: (p) => (
                <div className="flex flex-wrap gap-1">
                  {p.compliance_tags.map((tag) => (
                    <ComplianceBadge key={tag} tag={tag} />
                  ))}
                </div>
              ),
            },
          ]}
          rows={products}
          getRowHref={(p) => `/products/${p.id}`}
        />
      </ZoneSection>

      <ZoneSection zone={2} title="Ingredient overlap with portfolio">
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <p>
            <strong>{company.name}</strong> shares{" "}
            <strong>{sharedIngredients} ingredient{sharedIngredients !== 1 ? "s" : ""}</strong> with{" "}
            <strong>{sharedWith} other portfolio compan{sharedWith !== 1 ? "ies" : "y"}</strong>.
          </p>
          <p className="mt-2 text-muted-foreground">
            These shared ingredients represent consolidation and substitution opportunities.{" "}
            <Link href="/" className="underline hover:text-foreground">
              View portfolio-level opportunities →
            </Link>
          </p>
        </div>

        <div className="mt-4">
          <DataTable
            columns={[
              { key: "ingredient", label: "Ingredient", render: (i) => i.canonical_name },
              {
                key: "sharedWith",
                label: "Also used by",
                render: (i) => {
                  const others = getCompaniesUsingIngredient(i.id).filter((c) => c.id !== companyId)
                  return others.length > 0
                    ? others.map((c) => c.name).join(", ")
                    : <span className="text-muted-foreground">Only this company</span>
                },
              },
              {
                key: "supplier",
                label: "Current supplier",
                render: (i) => {
                  const s = getSupplierForCompanyIngredient(companyId, i.id)
                  return s ? s.name : <span className="text-muted-foreground">—</span>
                },
              },
            ]}
            rows={ingredients}
            getRowHref={(i) => `/ingredients/${i.id}`}
          />
        </div>
      </ZoneSection>

      <ZoneSection zone={3} title="Supplier overview">
        <DataTable
          columns={[
            {
              key: "name",
              label: "Supplier",
              render: (s) => s.name,
            },
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
              key: "portfolio",
              label: "Portfolio-wide",
              render: (s) =>
                s.served_companies.length > 1 ? (
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Shared ({s.served_companies.length} cos.)
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Unique</span>
                ),
            },
          ]}
          rows={[...supplierIds].map((id) => getSupplier(id)).filter((x): x is NonNullable<typeof x> => x != null)}
        />
      </ZoneSection>
    </AppShell>
  )
}
