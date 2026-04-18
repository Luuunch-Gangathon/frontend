"use client"
import { useCart } from "@/lib/cart-context"

interface PlanCartButtonProps {
  opportunityId: string
}

export function PlanCartButton({ opportunityId }: PlanCartButtonProps) {
  const { items, add, remove } = useCart()
  const inCart = items.includes(opportunityId)

  return (
    <button
      onClick={() => (inCart ? remove(opportunityId) : add(opportunityId))}
      className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        inCart
          ? "border border-border bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          : "border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
      }`}
    >
      {inCart ? "✓ In plan" : "+ Add to plan"}
    </button>
  )
}

export function CartBadge() {
  const { items } = useCart()
  if (items.length === 0) return null
  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {items.length}
    </span>
  )
}
