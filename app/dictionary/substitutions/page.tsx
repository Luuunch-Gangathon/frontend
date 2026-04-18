import { AppShell } from "@/components/layout/app-shell"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export default function DictionarySubstitutionsPage() {
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
          Use the Chat tab to explore ingredient substitutions on demand.
        </p>
      </div>
    </AppShell>
  )
}
