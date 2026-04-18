import { notFound } from "next/navigation"
import { getSupplier } from "@/lib/api"
import {
  getRawMaterialsForSupplier,
  getCompaniesForSupplier,
  getSuppliersForRawMaterial,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { Section } from "@/components/blocks/section"
import { DataTable } from "@/components/blocks/data-table"
import { CompanyBadge } from "@/components/blocks/company-badge"
import type { RawMaterial, Company } from "@/lib/types"

export default async function SupplierPage({
  params,
}: {
  params: Promise<{ supplierId: string }>
}) {
  const { supplierId } = await params
  const numericSupplierId = parseInt(supplierId, 10)

  let supplier
  try {
    supplier = await getSupplier(numericSupplierId)
  } catch {
    notFound()
  }

  const rawMaterials = getRawMaterialsForSupplier(numericSupplierId)
  const companies = getCompaniesForSupplier(numericSupplierId)

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Dictionary", href: "/dictionary" },
          { label: "Suppliers", href: "/dictionary/suppliers" },
          { label: supplier.name },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">{supplier.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Raw material supplier</p>
      </div>

      <StatsStrip
        className="mt-6"
        stats={[
          { label: "Raw materials supplied", value: rawMaterials.length },
          { label: "Companies served", value: companies.length },
        ]}
      />

      <Section title="Raw materials supplied">
        <DataTable<RawMaterial>
          columns={[
            {
              key: "sku",
              label: "SKU",
              render: (r) => <code className="font-mono text-xs">{r.sku}</code>,
            },
            {
              key: "competing",
              label: "Total suppliers for this RM",
              render: (r) => getSuppliersForRawMaterial(r.id).length,
            },
          ]}
          rows={rawMaterials}
          getRowHref={(r) => `/raw-materials/${r.id}`}
        />
      </Section>

      <Section title="Companies served">
        {companies.length > 0 ? (
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap gap-2">
              {companies.map((c: Company) => (
                <CompanyBadge key={c.id} id={c.id} name={c.name} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No portfolio companies use this supplier.</p>
        )}
      </Section>
    </AppShell>
  )
}
