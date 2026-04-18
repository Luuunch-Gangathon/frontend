import { notFound } from "next/navigation"
import {
  getProduct,
  getCompany,
  getRawMaterialsForProduct,
  getSuppliersForRawMaterial,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { Section } from "@/components/blocks/section"
import { DataTable } from "@/components/blocks/data-table"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
  const product = getProduct(productId)
  if (!product) notFound()

  const company = getCompany(product.company_id)!
  const rawMaterials = getRawMaterialsForProduct(productId)

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Spherecast", href: "/" },
          { label: company.name, href: `/companies/${company.id}` },
          { label: product.sku },
        ]}
      />

      <div className="mt-4">
        <code className="text-2xl font-semibold font-mono">{product.sku}</code>
        <p className="mt-1 text-sm text-muted-foreground">{company.name} — finished good</p>
      </div>

      <Section title="Bill of materials">
        <DataTable
          columns={[
            { key: "sku", label: "Raw material SKU", render: (r) => <code className="font-mono text-xs">{r.sku}</code> },
            {
              key: "suppliers",
              label: "Suppliers",
              render: (r) => {
                const suppliers = getSuppliersForRawMaterial(r.id)
                return suppliers.length > 0
                  ? suppliers.map((s) => s.name).join(", ")
                  : <span className="text-muted-foreground">—</span>
              },
            },
          ]}
          rows={rawMaterials}
          getRowHref={(r) => `/raw-materials/${r.id}`}
        />
      </Section>
    </AppShell>
  )
}
