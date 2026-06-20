'use client';

import { useState } from 'react';

export default function RequestStockButton({
  code,
  compact = false,
}: {
  code: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!phone.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, phone: phone.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  function stop(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (status === 'sent') {
    return (
      <span className={compact ? 'text-[11px] text-emerald-600 font-medium' : 'text-sm text-emerald-600 font-medium'}>
        ✅ Заявка принята, свяжемся с вами
      </span>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          setOpen(true);
        }}
        className={
          compact
            ? 'text-[11px] font-semibold text-violet-600 hover:text-violet-800'
            : 'text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition-colors'
        }
      >
        Запросить
      </button>
    );
  }

  return (
    <form onSubmit={submit} onClick={stop} className="flex items-center gap-1.5">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onClick={stop}
        placeholder="+998 90 123 45 67"
        className={
          compact
            ? 'w-[110px] text-[11px] border border-gray-200 rounded-md px-1.5 py-1 outline-none focus:border-violet-400'
            : 'flex-1 text-sm border-2 border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-400'
        }
        autoFocus
      />
      <button
        type="submit"
        onClick={stop}
        disabled={status === 'sending'}
        className={
          compact
            ? 'text-[11px] font-semibold text-violet-600 disabled:opacity-50 whitespace-nowrap'
            : 'text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 px-3 py-1.5 rounded-lg whitespace-nowrap'
        }
      >
        {status === 'sending' ? '...' : 'OK'}
      </button>
      {status === 'error' && (
        <span className="text-[11px] text-red-500 whitespace-nowrap">Ошибка</span>
      )}
    </form>
  );
}
