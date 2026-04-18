import type { ReactNode } from 'react'

interface SlideShellProps {
  active: boolean
  children: ReactNode
}

export function SlideShell({ active, children }: SlideShellProps) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${
        active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
      }`}
      aria-hidden={!active}
    >
      {children}
    </div>
  )
}
