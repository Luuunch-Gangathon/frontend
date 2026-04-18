"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartContextValue {
  items: string[]
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue>({
  items: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("plan-cart")
      if (stored) setItems(JSON.parse(stored))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem("plan-cart", JSON.stringify(items))
  }, [items, hydrated])

  const add = (id: string) =>
    setItems((prev) => (prev.includes(id) ? prev : [...prev, id]))
  const remove = (id: string) =>
    setItems((prev) => prev.filter((x) => x !== id))
  const clear = () => setItems([])

  return (
    <CartContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
