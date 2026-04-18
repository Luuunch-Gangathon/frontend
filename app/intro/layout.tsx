import type { ReactNode } from 'react'

export default function IntroLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[oklch(0.06_0_0)]">
      {children}
    </div>
  )
}
