import Link from "next/link"
import { getCompanies, getProducts, getRawMaterials, getSuppliers, getSubstitutions } from "@/lib/api"
import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export default async function DictionaryPage() {
  const [companies, products, rawMaterials, suppliers, substitutions] = await Promise.all([
    getCompanies(),
    getProducts(),
    getRawMaterials(),
    getSuppliers(),
    getSubstitutions(),
  ])

  const sections = [
    { label: "Companies", count: companies.length, href: "/dictionary/companies", description: "Portfolio companies and their finished goods" },
    { label: "Products", count: products.length, href: "/dictionary/products", description: "Finished goods across all portfolio companies" },
    { label: "Raw Materials", count: rawMaterials.length, href: "/dictionary/raw-materials", description: "Excipients and active pharmaceutical inputs" },
    { label: "Suppliers", count: suppliers.length, href: "/dictionary/suppliers", description: "Qualified raw material suppliers" },
    { label: "Substitutions", count: substitutions.length, href: "/dictionary/substitutions", description: "Known functionally-equivalent raw material swaps" },
  ]

  return (
    <AppShell>
      <Breadcrumb items={[{ label: "Dictionary" }]} />

      <div className="mt-4">
        <h1 className="text-2xl font-semibold">Dictionary</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reference data — companies, products, raw materials, suppliers, and substitutions.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-border bg-card p-6 hover:bg-muted transition-colors"
          >
            <div className="text-3xl font-semibold tabular-nums">{s.count}</div>
            <div className="mt-1 text-base font-medium">{s.label}</div>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  )
}
