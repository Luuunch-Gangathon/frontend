'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SlideShell } from './slide-shell'
import { BrandReveal } from './slides/brand-reveal'
import { Problem } from './slides/problem'
import { Benchmarks } from './slides/benchmarks'
import { Architecture } from './slides/architecture'
import { FeatureTeaser } from './slides/feature-teaser'
import { MacbookReveal } from './slides/macbook-reveal'

const SLIDE_COUNT = 6

export function Presentation() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isZooming, setIsZooming] = useState(false)
  const exitingRef = useRef(false)
  const zoomingRef = useRef(false)

  const exit = useCallback(() => {
    if (exitingRef.current) return
    exitingRef.current = true
    setIsExiting(true)
    setTimeout(() => router.push('/'), 380)
  }, [router])

  const zoomToApp = useCallback(() => {
    if (zoomingRef.current || exitingRef.current) return
    zoomingRef.current = true
    setIsZooming(true)
    setTimeout(() => router.push('/'), 600)
  }, [router])

  const next = useCallback(() => {
    if (current < SLIDE_COUNT - 1) {
      setCurrent((c) => c + 1)
    } else {
      zoomToApp()
    }
  }, [current, zoomToApp])

  const prev = useCallback(() => {
    if (current > 0) setCurrent((c) => c - 1)
  }, [current])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      } else if (e.key === 'Escape') {
        exit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, exit])

  return (
    <div
      className="relative w-full h-full cursor-pointer select-none"
      onClick={next}
    >
      <SlideShell active={current === 0}>
        <BrandReveal active={current === 0} onExit={exit} />
      </SlideShell>

      <SlideShell active={current === 1}>
        <Problem active={current === 1} onExit={exit} />
      </SlideShell>

      <SlideShell active={current === 2}>
        <Benchmarks active={current === 2} onExit={exit} />
      </SlideShell>

      <SlideShell active={current === 3}>
        <Architecture active={current === 3} onExit={exit} />
      </SlideShell>

      <SlideShell active={current === 4}>
        <FeatureTeaser active={current === 4} />
      </SlideShell>

      <SlideShell active={current === 5}>
        <MacbookReveal active={current === 5} zooming={isZooming} onLaunch={zoomToApp} />
      </SlideShell>

      {/* Progress bars — hidden while zooming */}
      {!isZooming && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50 pointer-events-none">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`h-[2px] rounded-full transition-all duration-500 ${
                i === current
                  ? 'w-8 bg-white/70'
                  : i < current
                    ? 'w-4 bg-white/35'
                    : 'w-4 bg-white/15'
              }`}
            />
          ))}
        </div>
      )}

      {/* Skip — hidden while zooming */}
      {!isZooming && (
        <button
          className="absolute top-6 right-6 z-50 text-xs text-white/25 hover:text-white/65 transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            exit()
          }}
        >
          Skip →
        </button>
      )}

      {/* Exit overlay */}
      {isExiting && (
        <div
          className="absolute inset-0 z-[100] pointer-events-none bg-background"
          style={{ animation: 'fadeOverlay 0.4s ease-out both' }}
        />
      )}
    </div>
  )
}
