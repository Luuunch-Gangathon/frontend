'use client';

import { useState } from 'react';
import {
  complianceCheck,
  enrichIngredient,
  getConsolidationGroup,
  getIngredientSuppliers,
  getIngredients,
  listConsolidationGroups,
  rankSuppliers,
} from '@/lib/api';
import { API_BASE_URL } from '@/lib/env';
import { useChatStream } from '@/hooks/useChatStream';

type Status = 'idle' | 'loading' | 'ok' | 'error';

interface Result {
  label: string;
  status: Status;
  data: unknown;
  error: string | null;
}

const INIT: Result = { label: '', status: 'idle', data: null, error: null };

export default function Home() {
  const [result, setResult] = useState<Result>(INIT);
  const chat = useChatStream();

  async function run(label: string, fn: () => Promise<unknown>) {
    setResult({ label, status: 'loading', data: null, error: null });
    chat.reset();
    try {
      const data = await fn();
      setResult({ label, status: 'ok', data, error: null });
    } catch (err) {
      setResult({
        label,
        status: 'error',
        data: null,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  async function health() {
    const res = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  function sendChat() {
    setResult({ label: 'POST /chat (SSE)', status: 'loading', data: null, error: null });
    chat.send(
      [{ role: 'user', content: 'Hello, give me a one-line status.' }],
      `test-${Date.now()}`,
    );
  }

  const buttons: { label: string; onClick: () => void }[] = [
    { label: 'GET /health', onClick: () => run('GET /health', health) },
    { label: 'GET /ingredients', onClick: () => run('GET /ingredients', () => getIngredients()) },
    {
      label: 'GET /ingredients?name=lecithin&company_id=co_1',
      onClick: () =>
        run('GET /ingredients (filtered)', () =>
          getIngredients({ name: 'lecithin', company_id: 'co_1' }),
        ),
    },
    {
      label: 'GET /ingredients/ing_1/suppliers',
      onClick: () =>
        run('GET /ingredients/ing_1/suppliers', () => getIngredientSuppliers('ing_1')),
    },
    {
      label: 'GET /consolidation-groups',
      onClick: () => run('GET /consolidation-groups', () => listConsolidationGroups()),
    },
    {
      label: 'GET /consolidation-groups/cg_1',
      onClick: () => run('GET /consolidation-groups/cg_1', () => getConsolidationGroup('cg_1')),
    },
    {
      label: 'GET /enrich/lecithin',
      onClick: () => run('GET /enrich/lecithin', () => enrichIngredient('lecithin')),
    },
    {
      label: 'POST /compliance-check',
      onClick: () =>
        run('POST /compliance-check', () =>
          complianceCheck({
            ingredient_id: 'ing_1',
            requirements: ['allergen-free', 'non-GMO'],
          }),
        ),
    },
    {
      label: 'GET /suppliers/rank?ingredient_id=ing_1',
      onClick: () =>
        run('GET /suppliers/rank', () => rankSuppliers({ ingredient_id: 'ing_1' })),
    },
    { label: 'POST /chat (SSE)', onClick: sendChat },
  ];

  const isChat = result.label === 'POST /chat (SSE)';
  const displayStatus: Status = isChat
    ? chat.status === 'streaming'
      ? 'loading'
      : chat.status === 'error'
        ? 'error'
        : chat.status === 'done'
          ? 'ok'
          : result.status
    : result.status;

  const displayData = isChat ? chat.events : result.data;
  const displayError = isChat ? chat.error?.message ?? null : result.error;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            API endpoint tester
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Backend: <code className="font-mono">{API_BASE_URL}</code>
          </p>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {buttons.map((b) => (
            <button
              key={b.label}
              onClick={b.onClick}
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-sm font-mono text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              {b.label}
            </button>
          ))}
        </section>

        <section className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {result.label || 'No request yet'}
            </div>
            <StatusBadge status={displayStatus} />
          </div>

          {displayError && (
            <pre className="overflow-auto rounded bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">
              {displayError}
            </pre>
          )}

          {displayData != null && (
            <pre className="max-h-[60vh] overflow-auto rounded bg-zinc-50 p-3 text-xs text-zinc-900 dark:bg-black dark:text-zinc-100">
              {JSON.stringify(displayData, null, 2)}
            </pre>
          )}
        </section>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string }> = {
    idle: { label: 'idle', cls: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
    loading: { label: 'loading…', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    ok: { label: 'ok', cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    error: { label: 'error', cls: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
  };
  const { label, cls } = map[status];
  return <span className={`rounded px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}
