import { visit, SKIP } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Link, PhrasingContent, Root, Text } from 'mdast'

const SKU_RE = /\bRM-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)+-[a-f0-9]{8}\b/g

export const remarkSku: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'text', (node: Text, index, parent) => {
    if (!parent || typeof index !== 'number') return
    if (parent.type === 'link' || parent.type === 'linkReference') return

    const value = node.value
    SKU_RE.lastIndex = 0
    if (!SKU_RE.test(value)) return

    SKU_RE.lastIndex = 0
    const out: PhrasingContent[] = []
    let cursor = 0
    for (let m = SKU_RE.exec(value); m; m = SKU_RE.exec(value)) {
      const start = m.index
      const end = start + m[0].length
      if (start > cursor) out.push({ type: 'text', value: value.slice(cursor, start) })
      const link: Link = {
        type: 'link',
        url: `#sku-${m[0]}`,
        title: null,
        children: [{ type: 'text', value: m[0] }],
      }
      out.push(link)
      cursor = end
    }
    if (cursor < value.length) out.push({ type: 'text', value: value.slice(cursor) })

    parent.children.splice(index, 1, ...out)
    return [SKIP, index + out.length]
  })
}
