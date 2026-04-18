import type { SearchHit } from '@/lib/types'

interface SearchResultsListProps {
  hits: SearchHit[]
}

export function SearchResultsList({ hits }: SearchResultsListProps) {
  if (hits.length === 0) {
    return <p className="text-xs text-muted-foreground">No results found.</p>
  }
  return (
    <ul className="space-y-2">
      {hits.map((hit, i) => (
        <li key={i} className="rounded-md border border-border bg-muted/40 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium">{hit.raw_material_name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {(hit.similarity * 100).toFixed(0)}% match
            </span>
          </div>
          {(hit.companies.length > 0 || hit.suppliers.length > 0) && (
            <div className="mt-1 flex flex-wrap gap-1">
              {hit.companies.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="inline-block rounded-full bg-background border border-border px-1.5 py-0 text-[10px] text-muted-foreground"
                >
                  {c}
                </span>
              ))}
              {hit.companies.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{hit.companies.length - 3}
                </span>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
