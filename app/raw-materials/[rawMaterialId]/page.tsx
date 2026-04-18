import { notFound } from "next/navigation"
import { getRawMaterial } from "@/lib/api"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { StatsStrip } from "@/components/blocks/stats-strip"

export default async function RawMaterialPage({
  params,
}: {
  params: Promise<{ rawMaterialId: string }>
}) {
  const { rawMaterialId } = await params
  const name = decodeURIComponent(rawMaterialId)

  let rawMaterial
  try {
    rawMaterial = await getRawMaterial(name)
  } catch {
    notFound()
  }

  return (
    <AppShell>
      <Breadcrumb
        items={[
          { label: "Raw Materials", href: "/dictionary/raw-materials" },
          { label: rawMaterial.name },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">{rawMaterial.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Raw material — portfolio-wide</p>
      </div>

      <StatsStrip
        className="mt-6"
        stats={[
          { label: "Suppliers", value: rawMaterial.supplier_count },
          { label: "Used in products", value: rawMaterial.product_count },
        ]}
      />
    </AppShell>
  )
}
