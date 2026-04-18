import { getRawMaterials } from "@/lib/api"
import {
  SUPPLIER_RAW_MATERIALS,
  BOMS,
} from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { DataTable } from "@/components/blocks/data-table"
import type { RawMaterial } from "@/lib/types"

export default async function DictionaryRawMaterialsPage() {
  const rawMaterials = await getRawMaterials()

  function supplierCount(rmId: string) {
    return SUPPLIER_RAW_MATERIALS.filter((srm) => srm.raw_material_id === rmId).length
  }

  function productCount(rmId: string) {
    return BOMS.filter((b) => b.consumed_raw_material_ids.includes(rmId)).length
  }

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
            { key: "suppliers", label: "Suppliers", render: (r) => supplierCount(r.id) },
            { key: "products", label: "Used in products", render: (r) => productCount(r.id) },
          ]}
          rows={rawMaterials}
          getRowHref={(r) => `/raw-materials/${r.id}`}
        />
      </div>
    </AppShell>
  )
}
