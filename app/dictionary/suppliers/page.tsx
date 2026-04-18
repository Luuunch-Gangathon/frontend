import { getSuppliers } from "@/lib/api"
import { SUPPLIER_RAW_MATERIALS } from "@/lib/demo-data"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { DataTable } from "@/components/blocks/data-table"
import type { Supplier } from "@/lib/types"

export default async function DictionarySuppliersPage() {
  const suppliers = await getSuppliers()

  function rawMaterialCount(supplierId: number) {
    return SUPPLIER_RAW_MATERIALS.filter((srm) => srm.supplier_id === supplierId).length
  }

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Dictionary", href: "/dictionary" },
          { label: "Suppliers" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Suppliers</h1>
        <p className="mt-1 text-sm text-muted-foreground">{suppliers.length} qualified raw material suppliers</p>
      </div>

      <div className="mt-8">
        <DataTable<Supplier>
          columns={[
            { key: "name", label: "Supplier", render: (s) => s.name },
            { key: "rms", label: "Raw materials supplied", render: (s) => rawMaterialCount(s.id) },
          ]}
          rows={suppliers}
          getRowHref={(s) => `/suppliers/${s.id}`}
        />
      </div>
    </AppShell>
  )
}
