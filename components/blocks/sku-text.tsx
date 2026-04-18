import { Fragment, type ReactNode } from 'react'
import { SkuChip } from './sku-chip'

const SKU_RE = /\bRM-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+-[a-f0-9]{8}\b/g

export function SkuText({ children }: { children: string }) {
  const nodes: ReactNode[] = []
  let cursor = 0

  for (const m of children.matchAll(SKU_RE)) {
    const start = m.index ?? 0
    const end = start + m[0].length
    if (start > cursor) nodes.push(<Fragment key={`t-${cursor}`}>{children.slice(cursor, start)}</Fragment>)
    nodes.push(<SkuChip key={`s-${start}`} sku={m[0]} />)
    cursor = end
  }
  if (cursor < children.length) {
    nodes.push(<Fragment key={`t-${cursor}`}>{children.slice(cursor)}</Fragment>)
  }

  return <>{nodes}</>
}
