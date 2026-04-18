import { getSubstitutions, getRawMaterials } from "@/lib/api"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { DataTable } from "@/components/blocks/data-table"
import type { Substitution } from "@/lib/types"

export default async function DictionarySubstitutionsPage() {
  const [substitutions, rawMaterials] = await Promise.all([getSubstitutions(), getRawMaterials()])

  const rmMap = new Map(rawMaterials.map((r) => [r.id, r.sku]))

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Dictionary", href: "/dictionary" },
          { label: "Substitutions" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Substitutions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {substitutions.length} known functionally-equivalent raw material swaps
        </p>
      </div>

      <div className="mt-8">
        <DataTable<Substitution>
          columns={[
            {
              key: "from",
              label: "From SKU",
              render: (s) => <code className="font-mono text-xs">{rmMap.get(s.from_raw_material_id) ?? s.from_raw_material_id}</code>,
            },
            {
              key: "to",
              label: "To SKU",
              render: (s) => <code className="font-mono text-xs">{rmMap.get(s.to_raw_material_id) ?? s.to_raw_material_id}</code>,
            },
            {
              key: "reason",
              label: "Reason",
              render: (s) => <span className="text-sm">{s.reason}</span>,
            },
          ]}
          rows={substitutions}
        />
      </div>
    </AppShell>
  )
}
