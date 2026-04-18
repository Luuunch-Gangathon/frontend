'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { askAgnes, getAgnesSuggestions } from '@/lib/api'
import type { AgnesMessage, AgnesSuggestedQuestion } from '@/lib/types'

interface AskAgnesDrawerProps {
  proposalId: number
  proposalHeadline: string
}

const INTRO: AgnesMessage = {
  role: 'assistant',
  content: "Hi, I'm Agnes — your AI supply chain co-pilot. Ask me anything about this proposal: the reasoning, risks, compliance gaps, or supplier tradeoffs.",
}

export function AskAgnesDrawer({ proposalId, proposalHeadline }: AskAgnesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<AgnesMessage[]>([INTRO])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AgnesSuggestedQuestion[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadSuggestions = useCallback(async () => {
    try {
      const data = await getAgnesSuggestions(proposalId)
      setSuggestions(data)
    } catch {
      // silently fail
    }
  }, [proposalId])

  useEffect(() => {
    if (isOpen) {
      loadSuggestions()
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isOpen, loadSuggestions])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleClose = () => {
    setIsOpen(false)
    setMessages([INTRO])
    setInput('')
  }

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    const userMsg: AgnesMessage = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    try {
      const res = await askAgnes({ proposal_id: proposalId, message: trimmed, history: messages })
      setMessages((prev) => [...prev, res.reply])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Sorry, I ran into an error. Please try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages, proposalId])

  const showSuggestions = suggestions.length > 0 && messages.length <= 1

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
      >
        ✨ Ask Agnes
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
          onClick={handleClose}
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-96 flex-col bg-background shadow-xl transition-transform duration-300 border-l border-border",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Ask Agnes</p>
            <p className="text-xs text-muted-foreground truncate">{proposalHeadline}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-3 shrink-0 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                A
              </span>
              <span className="animate-pulse">Thinking…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showSuggestions && (
          <div className="border-t border-border px-4 py-3 shrink-0">
            <p className="mb-2 text-xs text-muted-foreground">Suggested questions</p>
            <div className="flex flex-col gap-1.5">
              {suggestions.map((sq) => (
                <button
                  key={sq.id}
                  onClick={() => sendMessage(sq.question)}
                  disabled={isLoading}
                  className="rounded-lg border border-border px-3 py-2 text-left text-xs hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {sq.question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border p-4 shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="Ask a question…"
              disabled={isLoading}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function MessageBubble({ message }: { message: AgnesMessage }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        A
      </span>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm">
          {message.content}
        </div>
        {message.reasoning_steps && message.reasoning_steps.length > 0 && (
          <details className="text-xs ml-1">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">
              Reasoning steps ({message.reasoning_steps.length})
            </summary>
            <ul className="mt-1.5 ml-2 space-y-1 border-l-2 border-muted pl-3">
              {message.reasoning_steps.map((step, i) => (
                <li key={i} className="text-muted-foreground">{step}</li>
              ))}
            </ul>
          </details>
        )}
        {message.cited_evidence_indices && message.cited_evidence_indices.length > 0 && (
          <p className="text-xs text-muted-foreground ml-1">
            Evidence cited:{' '}
            {message.cited_evidence_indices.map((idx, i) => (
              <span key={idx}>
                <a href="#evidence" className="underline hover:text-foreground">
                  [{idx + 1}]
                </a>
                {i < (message.cited_evidence_indices?.length ?? 0) - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  )
}
