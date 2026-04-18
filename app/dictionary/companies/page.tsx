import { getCompanies, getProducts } from "@/lib/api"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { DataTable } from "@/components/blocks/data-table"
import type { Company } from "@/lib/types"

export default async function DictionaryCompaniesPage() {
  const [companies, products] = await Promise.all([getCompanies(), getProducts()])

  const skuCounts = new Map<number, number>()
  for (const p of products) {
    skuCounts.set(p.company_id, (skuCounts.get(p.company_id) ?? 0) + 1)
  }

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Dictionary", href: "/dictionary" },
          { label: "Companies" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <p className="mt-1 text-sm text-muted-foreground">{companies.length} portfolio companies</p>
      </div>

      <div className="mt-8">
        <DataTable<Company>
          columns={[
            { key: "name", label: "Company", render: (c) => c.name },
            { key: "skus", label: "Finished goods", render: (c) => skuCounts.get(c.id) ?? 0 },
          ]}
          rows={companies}
          getRowHref={(c) => `/companies/${c.id}`}
        />
      </div>
    </AppShell>
  )
}
