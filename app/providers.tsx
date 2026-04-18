"use client"
import { CartProvider } from "@/lib/cart-context"
import { CompareProvider } from "@/lib/compare-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <CompareProvider>{children}</CompareProvider>
    </CartProvider>
  )
}
