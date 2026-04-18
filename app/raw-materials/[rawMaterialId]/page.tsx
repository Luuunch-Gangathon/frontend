import { notFound } from "next/navigation"
import { getRawMaterial } from "@/lib/api"
import {
  getSuppliersForRawMaterial,
  getFinishedGoodsUsingRawMaterial,
  getCompaniesUsingRawMaterial,
  getCompany,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { StatsStrip } from "@/components/blocks/stats-strip"
import { Section } from "@/components/blocks/section"
import { DataTable } from "@/components/blocks/data-table"
import { CompanyBadge } from "@/components/blocks/company-badge"
import type { Supplier, Product } from "@/lib/types"

export default async function RawMaterialPage({
  params,
}: {
  params: Promise<{ rawMaterialId: string }>
}) {
  const { rawMaterialId } = await params
  const numericRawMaterialId = parseInt(rawMaterialId, 10)

  let rawMaterial
  try {
    rawMaterial = await getRawMaterial(numericRawMaterialId)
  } catch {
    notFound()
  }

  const suppliers = getSuppliersForRawMaterial(numericRawMaterialId)
  const finishedGoods = getFinishedGoodsUsingRawMaterial(numericRawMaterialId)
  const companies = getCompaniesUsingRawMaterial(numericRawMaterialId)

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Spherecast", href: "/" },
          { label: rawMaterial.sku },
        ]}
      />

      <div className="mt-4">
        <code className="text-2xl font-semibold font-mono">{rawMaterial.sku}</code>
        <p className="mt-1 text-sm text-muted-foreground">Raw material — portfolio-wide</p>
      </div>

      <StatsStrip
        className="mt-6"
        stats={[
          { label: "Current suppliers", value: suppliers.length },
          { label: "Finished goods", value: finishedGoods.length },
          { label: "Companies", value: companies.length },
        ]}
      />

      <Section title="Current suppliers">
        <DataTable<Supplier>
          columns={[
            { key: "name", label: "Supplier", render: (s) => s.name },
          ]}
          rows={suppliers}
          getRowHref={(s) => `/suppliers/${s.id}`}
        />
      </Section>

      <Section title="Finished goods consuming this raw material">
        <DataTable<Product>
          columns={[
            { key: "sku", label: "SKU", render: (p) => <code className="font-mono text-xs">{p.sku}</code> },
            {
              key: "company",
              label: "Company",
              render: (p) => getCompany(p.company_id)?.name ?? String(p.company_id),
            },
          ]}
          rows={finishedGoods}
          getRowHref={(p) => `/products/${p.id}`}
        />
      </Section>

      <Section title="Companies using this raw material">
        <div className="flex flex-wrap gap-2">
          {companies.map((c) => (
            <CompanyBadge key={c.id} id={c.id} name={c.name} />
          ))}
        </div>
      </Section>
    </AppShell>
  )
}
