'use client'

import { useRef, useEffect } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { ToolCallBlock } from './tool-call-block'
import { SkuChip } from './sku-chip'
import { remarkSku } from '@/lib/remark-sku'
import type { ChatMessage, ToolCall } from '@/lib/types'

const MARKDOWN_COMPONENTS: Components = {
  a({ href, children, ...rest }) {
    if (href?.startsWith('#sku-')) {
      return <SkuChip sku={href.slice(5)} />
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  },
}

export type { ChatMessage }

const STARTER_PROMPTS = [
  "What if we replace whey protein isolate with pea protein isolate?",
  "Which suppliers do we fragment magnesium stearate across?",
  "Can we consolidate vitamin D3 sourcing?",
]

interface ChatPanelProps {
  messages: ChatMessage[]
  isLoading: boolean
  input: string
  onInputChange: (v: string) => void
  onSend: (text: string) => void
  sessionId: string
  decisions: Record<string, 'accepted' | 'declined'>
  onDecision: (key: string, status: 'accepted' | 'declined') => void
}

export function ChatPanel({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  sessionId,
  decisions,
  onDecision,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const hasUserMessage = messages.some((m) => m.role === 'user')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {messages.map((msg, i) => (
          <MessageGroup
            key={i}
            message={msg}
            sessionId={sessionId}
            decisions={decisions}
            onDecision={onDecision}
          />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <AgnesAvatar />
            <div className="flex-1 min-w-0">
              <ThinkingIndicator />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {!hasUserMessage && (
        <div className="mb-4 flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => onSend(p)}
              disabled={isLoading}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border pt-4 shrink-0">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSend(input)
              }
            }}
            placeholder="Ask about ingredient substitutions…"
            disabled={isLoading}
            rows={2}
            className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <button
            onClick={() => onSend(input)}
            disabled={isLoading || !input.trim()}
            className="self-end rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

function AgnesAvatar() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      A
    </span>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 rounded-md border border-dashed border-border px-3 py-2 text-xs">
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[pulse_1s_ease-in-out_infinite]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[pulse_1s_ease-in-out_infinite] [animation-delay:200ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[pulse_1s_ease-in-out_infinite] [animation-delay:400ms]" />
      </span>
      <span className="italic text-muted-foreground">Agnes is thinking…</span>
    </div>
  )
}

interface MessageGroupProps {
  message: ChatMessage
  sessionId: string
  decisions: Record<string, 'accepted' | 'declined'>
  onDecision: (key: string, status: 'accepted' | 'declined') => void
}

function MessageGroup({ message, sessionId, decisions, onDecision }: MessageGroupProps) {
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
    <div className="flex items-start gap-3">
      <AgnesAvatar />
      <div className="flex-1 min-w-0 space-y-3">
        {message.tool_calls && message.tool_calls.length > 0 && (
          <div className="space-y-2">
            {message.tool_calls.map((tc: ToolCall, i: number) => (
              <ToolCallBlock
                key={i}
                toolCall={tc}
                sessionId={sessionId}
                decisions={decisions}
                onDecision={onDecision}
              />
            ))}
          </div>
        )}
        {message.content && (
          <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkSku]} components={MARKDOWN_COMPONENTS}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
