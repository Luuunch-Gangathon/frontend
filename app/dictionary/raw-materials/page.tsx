import { getRawMaterials } from "@/lib/api"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { DataTable } from "@/components/blocks/data-table"
import type { RawMaterial } from "@/lib/types"

export default async function DictionaryRawMaterialsPage() {
  const rawMaterials = await getRawMaterials()

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Dictionary", href: "/dictionary" },
          { label: "Raw Materials" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Raw Materials</h1>
        <p className="mt-1 text-sm text-muted-foreground">{rawMaterials.length} excipients and actives</p>
      </div>

      <div className="mt-8">
        <DataTable<RawMaterial>
          columns={[
            { key: "sku", label: "SKU", render: (r) => <code className="font-mono text-xs">{r.sku}</code> },
            { key: "suppliers", label: "Suppliers", render: (r) => r.suppliers_count ?? 0 },
            { key: "products", label: "Used in products", render: (r) => r.used_products_count ?? 0 },
          ]}
          rows={rawMaterials}
          getRowHref={(r) => `/raw-materials/${r.id}`}
        />
      </div>
    </AppShell>
  )
}
