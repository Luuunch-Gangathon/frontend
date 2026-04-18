'use client'

import { useEffect, useState } from 'react'
import { getRawMaterials } from '@/lib/api'
import type { RawMaterial } from '@/lib/types'

type Index = Record<string, RawMaterial>

let cache: Index | null = null
let inflight: Promise<Index> | null = null

function loadIndex(): Promise<Index> {
  if (cache) return Promise.resolve(cache)
  if (inflight) return inflight
  inflight = getRawMaterials()
    .then((list) => {
      const idx: Index = {}
      for (const rm of list) idx[rm.sku] = rm
      cache = idx
      return idx
    })
    .finally(() => {
      inflight = null
    })
  return inflight
}

export function useRawMaterialIndex(): Index | null {
  const [idx, setIdx] = useState<Index | null>(cache)

  useEffect(() => {
    if (cache) return
    let cancelled = false
    loadIndex().then((i) => {
      if (!cancelled) setIdx(i)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return idx
}
