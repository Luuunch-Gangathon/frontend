'use client'

import { Popover } from 'radix-ui'
import { useRawMaterialIndex } from '@/lib/use-raw-material-index'

function prettifyName(sku: string): string {
  const parts = sku.split('-')
  if (parts.length < 3) return sku
  return parts.slice(2, -1).join(' ')
}

export function SkuChip({ sku }: { sku: string }) {
  const index = useRawMaterialIndex()
  const rm = index?.[sku]
  const name = prettifyName(sku)

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex max-w-full items-center rounded bg-primary/10 px-1.5 py-0.5 align-baseline font-mono text-[0.85em] text-primary break-all hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
        >
          {sku}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={6}
          collisionPadding={8}
          className="z-50 w-72 rounded-md border border-border bg-popover p-3 text-sm text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium capitalize">{name}</div>
              {rm && <span className="shrink-0 text-xs text-muted-foreground">#{rm.id}</span>}
            </div>
            <div className="font-mono text-xs text-muted-foreground break-all">{sku}</div>
            {rm ? (
              <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                <span>{rm.suppliers_count} suppliers</span>
                <span>{rm.used_products_count} products</span>
              </div>
            ) : index ? (
              <div className="mt-2 text-xs italic text-muted-foreground">
                Not found in raw-materials index.
              </div>
            ) : (
              <div className="mt-2 text-xs italic text-muted-foreground">Loading…</div>
            )}
          </div>
          <Popover.Arrow className="fill-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
