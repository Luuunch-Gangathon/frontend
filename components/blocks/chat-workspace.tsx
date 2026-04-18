'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { streamAgnes } from '@/lib/api'
import { aggregateEntities } from '@/lib/aggregate-entities'
import { ChatPanel } from './chat-panel'
import { ContextSidebar } from './context-sidebar'
import { ProductPicker } from './product-picker'
import type { ChatMessage, AssistantMessage, Product } from '@/lib/types'
import type { SidebarTab } from './context-sidebar'

function buildIntro(product: Product, companyName: string): AssistantMessage {
  return {
    role: 'assistant',
    content: `Hi, I'm Agnes. We're looking at **${product.sku}** from **${companyName}**. Ask me about ingredients, substitutions, supplier fragmentation, or compliance for this product.`,
    tool_calls: [],
  }
}

export function ChatWorkspace() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productCompany, setProductCompany] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [decisions, setDecisions] = useState<Record<string, 'accepted' | 'declined'>>({})
  const [activeTab, setActiveTab] = useState<SidebarTab>('materials')
  const prevMsgLengthRef = useRef(messages.length)

  const aggregated = useMemo(() => aggregateEntities(messages), [messages])

  const hasAnyToolCalls = useMemo(
    () => messages.some((m) => m.role === 'assistant' && m.tool_calls.length > 0),
    [messages]
  )

  useEffect(() => {
    const prevLen = prevMsgLengthRef.current
    prevMsgLengthRef.current = messages.length

    if (messages.length <= prevLen) return

    const lastMsg = messages[messages.length - 1]
    if (lastMsg.role !== 'assistant') return

    const hasMaterialCalls = lastMsg.tool_calls.some(
      (tc) => tc.name === 'search' || tc.name === 'similarity_compliance_check'
    )
    if (hasMaterialCalls) setActiveTab('materials')
  }, [messages])

  const handleProductSelect = useCallback((product: Product, companyName: string) => {
    setSelectedProduct(product)
    setProductCompany(companyName)
    setMessages([buildIntro(product, companyName)])
    setSessionId(null)
    setDecisions({})
    setInput('')
    setActiveTab('materials')
  }, [])

  const handleChangeProduct = useCallback(() => {
    setSelectedProduct(null)
    setProductCompany('')
    setMessages([])
    setSessionId(null)
    setDecisions({})
    setInput('')
    setActiveTab('materials')
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading || !selectedProduct) return

      setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
      setInput('')
      setIsLoading(true)

      let placeholderInserted = false
      const appendToken = (chunk: string) => {
        setMessages((prev) => {
          if (!placeholderInserted) {
            placeholderInserted = true
            return [...prev, { role: 'assistant', content: chunk, tool_calls: [] }]
          }
          const next = prev.slice()
          const last = next[next.length - 1]
          if (last?.role === 'assistant') {
            next[next.length - 1] = { ...last, content: last.content + chunk }
          }
          return next
        })
      }

      try {
        let streamErr: string | null = null
        await streamAgnes(
          {
            message: trimmed,
            session_id: sessionId,
            product_id: sessionId ? null : selectedProduct.id,
          },
          {
            onSession: (sid) => setSessionId(sid),
            onToken: appendToken,
            onError: (msg) => {
              streamErr = msg
            },
          },
        )
        if (streamErr) throw new Error(streamErr)
      } catch {
        setMessages((prev) => {
          if (placeholderInserted) return prev
          return [
            ...prev,
            { role: 'assistant', content: 'Sorry, I ran into an error. Please try again.', tool_calls: [] },
          ]
        })
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, sessionId, selectedProduct]
  )

  function handleDecision(key: string, status: 'accepted' | 'declined') {
    setDecisions((prev) => ({ ...prev, [key]: status }))
  }

  // No product selected → show picker
  if (!selectedProduct) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Ask Agnes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore ingredient substitutions across the portfolio.
          </p>
        </div>
        <ProductPicker onSelect={handleProductSelect} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Ask Agnes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore ingredient substitutions across the portfolio.
          </p>
        </div>
        <ProductContextPill
          product={selectedProduct}
          companyName={productCompany}
          onChange={handleChangeProduct}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(340px,400px)_1fr]">
        <div className="order-2 lg:order-1">
          <ContextSidebar
            aggregated={aggregated}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasAnyToolCalls={hasAnyToolCalls}
          />
        </div>
        <div className="order-1 lg:order-2">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            input={input}
            onInputChange={setInput}
            onSend={sendMessage}
            sessionId={sessionId ?? ''}
            decisions={decisions}
            onDecision={handleDecision}
          />
        </div>
      </div>
    </div>
  )
}

function ProductContextPill({
  product,
  companyName,
  onChange,
}: {
  product: Product
  companyName: string
  onChange: () => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs shadow-sm">
      <span className="text-sm">📦</span>
      <div className="flex items-center gap-1.5">
        <code className="font-mono font-medium">{product.sku}</code>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{companyName}</span>
      </div>
      <button
        onClick={onChange}
        className="ml-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="Start a new chat with a different product"
      >
        Change
      </button>
    </div>
  )
}
