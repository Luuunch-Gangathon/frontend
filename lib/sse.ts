import type { EvidenceItem } from '@/lib/types';

export type ChatEvent =
  | { type: 'text'; content: string }
  | { type: 'tool_call'; name: string; args: unknown }
  | { type: 'tool_result'; name: string; result: unknown }
  | { type: 'evidence'; items: EvidenceItem[] }
  | { type: 'trace'; agent?: string; step: string }
  | { type: 'done' };

export async function* parseSSE(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<ChatEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        const dataLines = frame
          .split('\n')
          .filter((l) => l.startsWith('data:'))
          .map((l) => l.slice(5).trimStart());
        if (dataLines.length === 0) continue;

        const payload = dataLines.join('\n');
        try {
          yield JSON.parse(payload) as ChatEvent;
        } catch {
          // malformed frame — drop and keep going
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
