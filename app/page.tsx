'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

interface CatalogItem {
  code: string;
  name: string;
  producer: string;
  group: string;
  barcodes: string[];
  price: number;
}

const PAGE_SIZE = 50;

export default function ProductsPage() {
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        setProducts(j.data || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return products;
    return products.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.barcodes.some((b) => b.includes(q))
    );
  }, [products, q]);

  useEffect(() => setPage(1), [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const shown = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-xl font-bold">📚 Справочник товаров</h2>
        <span className="text-sm text-gray-400">{loading ? '…' : `${products.length} шт.`}</span>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Поиск по названию, коду или штрихкоду..."
        autoFocus
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4
                   outline-none focus:border-blue-400 transition-colors bg-white"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] gap-3 text-gray-500">
          <span className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          Загрузка справочника...
        </div>
      ) : shown.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">Ничего не найдено</div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-2">Найдено: {filtered.length}</p>
          <div className="flex flex-col gap-1.5">
            {shown.map((p) => (
              <Link
                key={p.code}
                href={`/products/${encodeURIComponent(p.code)}`}
                className="bg-white rounded-lg shadow-sm px-3 py-2 flex items-center gap-3
                           hover:ring-2 hover:ring-blue-200 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[13px] leading-tight truncate">{p.name || '—'}</div>
                  <div className="text-[11px] text-gray-400 truncate">
                    Код {p.code}
                    {p.producer && ` · ${p.producer}`}
                  </div>
                </div>
                {p.price > 0 && (
                  <span className="text-[13px] font-semibold text-emerald-700 whitespace-nowrap">
                    {p.price.toLocaleString('ru-RU')}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 my-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-sm disabled:opacity-40"
              >
                ← Назад
              </button>
              <span className="text-sm text-gray-500">Стр. {safePage} из {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-sm disabled:opacity-40"
              >
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
