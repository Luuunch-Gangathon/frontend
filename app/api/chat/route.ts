import { API_BASE_URL, USE_MOCKS } from '@/lib/env';
import { mockChatStream } from '@/lib/mocks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
};

export async function POST(req: Request) {
  const body = await req.text();

  if (USE_MOCKS) {
    return new Response(mockChatStream(), { headers: SSE_HEADERS });
  }

  const upstream = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    return new Response(detail || 'upstream error', { status: upstream.status || 502 });
  }

  return new Response(upstream.body, { headers: SSE_HEADERS });
}
