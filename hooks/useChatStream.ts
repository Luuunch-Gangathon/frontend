'use client';

import { useCallback, useRef, useState } from 'react';
import { parseSSE, type ChatEvent } from '@/lib/sse';
import type { Message } from '@/lib/types';

export type ChatStatus = 'idle' | 'streaming' | 'done' | 'error';

export interface UseChatStream {
  events: ChatEvent[];
  status: ChatStatus;
  error: Error | null;
  send: (messages: Message[], sessionId: string) => Promise<void>;
  abort: () => void;
  reset: () => void;
}

export function useChatStream(): UseChatStream {
  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    abort();
    setEvents([]);
    setStatus('idle');
    setError(null);
  }, [abort]);

  const send = useCallback(async (messages: Message[], sessionId: string) => {
    abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setEvents([]);
    setError(null);
    setStatus('streaming');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, session_id: sessionId }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`chat stream failed: ${res.status} ${res.statusText}`);
      }

      for await (const event of parseSSE(res.body)) {
        setEvents((prev) => [...prev, event]);
        if (event.type === 'done') break;
      }

      setStatus('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setStatus('idle');
        return;
      }
      setError(err as Error);
      setStatus('error');
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, [abort]);

  return { events, status, error, send, abort, reset };
}
