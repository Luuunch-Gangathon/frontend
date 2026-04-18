import { notFound } from "next/navigation"
import { getCompany, getProducts } from "@/lib/api"
import {
  getRawMaterialsForProduct,
  getSuppliersForRawMaterial,
  getCompaniesUsingRawMaterial,
  getCompany as getCompanyFromData,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { Section } from "@/components/blocks/section"
import { DataTable } from "@/components/blocks/data-table"
import { CompanyBadge } from "@/components/blocks/company-badge"
import type { Product } from "@/lib/types"

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params
  const numericCompanyId = parseInt(companyId, 10)

  let company
  try {
    company = await getCompany(numericCompanyId)
  } catch {
    notFound()
  }

  const products = await getProducts({ company_id: numericCompanyId })

  const rawMaterialIds = new Set<number>()
  for (const p of products) {
    for (const rm of getRawMaterialsForProduct(p.id)) {
      rawMaterialIds.add(rm.id)
    }
  }

  const supplierIds = new Set<number>()
  for (const rmId of rawMaterialIds) {
    for (const s of getSuppliersForRawMaterial(rmId)) {
      supplierIds.add(s.id)
    }
  }

  const sharedCompanyIds = new Set<number>()
  let sharedRawMaterialCount = 0
  for (const rmId of rawMaterialIds) {
    const others = getCompaniesUsingRawMaterial(rmId).filter((c) => c.id !== numericCompanyId)
    if (others.length > 0) {
      sharedRawMaterialCount++
      others.forEach((c) => sharedCompanyIds.add(c.id))
    }
  }
  const sharedCompanies = [...sharedCompanyIds]
    .map((id) => getCompanyFromData(id))
    .filter((c): c is NonNullable<typeof c> => c != null)

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
          { label: "Finished goods", value: products.length },
          { label: "Raw materials", value: rawMaterialIds.size },
          { label: "Suppliers", value: supplierIds.size },
          { label: "Portfolio overlap", value: sharedCompanies.length },
        ]}
      />

      <Section title="Finished goods">
        <DataTable<Product>
          columns={[
            { key: "sku", label: "SKU", render: (p) => <code className="font-mono text-xs">{p.sku}</code> },
            {
              key: "rms",
              label: "Raw materials",
              render: (p) => getRawMaterialsForProduct(p.id).length,
            },
          ]}
          rows={products}
          getRowHref={(p) => `/products/${p.id}`}
        />
      </Section>

      <Section title="Shared with portfolio companies">
        {sharedCompanies.length > 0 ? (
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground mb-4">
              Shared with{" "}
              <strong>{sharedCompanies.length} other portfolio compan{sharedCompanies.length !== 1 ? "ies" : "y"}</strong>{" "}
              via <strong>{sharedRawMaterialCount} raw material{sharedRawMaterialCount !== 1 ? "s" : ""}</strong>.
            </p>
            <div className="flex flex-wrap gap-2">
              {sharedCompanies.map((c) => (
                <CompanyBadge key={c.id} id={c.id} name={c.name} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No shared raw materials with other portfolio companies.</p>
        )}
      </Section>
    </AppShell>
  )
}
