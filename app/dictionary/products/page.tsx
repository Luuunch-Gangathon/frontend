import { getProducts, getCompanies } from "@/lib/api"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { DataTable } from "@/components/blocks/data-table"
import type { Product } from "@/lib/types"

export default async function DictionaryProductsPage() {
  const [products, companies] = await Promise.all([getProducts(), getCompanies()])

  const companyMap = new Map(companies.map((c) => [c.id, c.name]))

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Dictionary", href: "/dictionary" },
          { label: "Products" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">{products.length} finished goods across all companies</p>
      </div>

      <div className="mt-8">
        <DataTable<Product>
          columns={[
            { key: "sku", label: "SKU", render: (p) => <code className="font-mono text-xs">{p.sku}</code> },
            { key: "company", label: "Company", render: (p) => companyMap.get(p.company_id) ?? p.company_id },
          ]}
          rows={products}
          getRowHref={(p) => `/products/${p.id}`}
        />
      </div>
    </AppShell>
  )
}
