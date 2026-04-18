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
            { key: "name", label: "Name", render: (r) => r.name },
            { key: "supplier_count", label: "Suppliers", render: (r) => r.supplier_count },
            { key: "product_count", label: "Used in products", render: (r) => r.product_count },
          ]}
          rows={rawMaterials}
          getRowHref={(r) => `/raw-materials/${encodeURIComponent(r.name)}`}
        />
      </div>
    </AppShell>
  )
}
