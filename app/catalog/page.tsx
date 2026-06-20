'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/app/components/ProductCard';

interface CatalogItem {
  code: string;
  name: string;
  producer: string;
  group: string;
  barcodes: string[];
  price: number;
}

const PAGE_SIZE = 60;

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogPageInner />
    </Suspense>
  );
}

function CatalogPageInner() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [group, setGroup] = useState(searchParams.get('group') || '');
  const [producer, setProducer] = useState(searchParams.get('producer') || '');
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

  const groups = useMemo(
    () => [...new Set(products.map((p) => p.group).filter(Boolean))].sort(),
    [products]
  );
  const producers = useMemo(
    () => [...new Set(products.map((p) => p.producer).filter(Boolean))].sort(),
    [products]
  );

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (group && p.group !== group) return false;
      if (producer && p.producer !== producer) return false;
      if (!q) return true;
      return (
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.barcodes.some((b) => b.includes(q))
      );
    });
  }, [products, q, group, producer]);

  useEffect(() => setPage(1), [q, group, producer]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const shown = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-xl font-bold">Каталог товаров</h2>
        <span className="text-sm text-gray-400">{loading ? '…' : `${products.length} шт.`}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Поиск по названию, коду или штрихкоду..."
          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm
                     outline-none focus:border-blue-400 transition-colors bg-white"
        />
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-blue-400"
        >
          <option value="">Все группы</option>
          {groups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={producer}
          onChange={(e) => setProducer(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-blue-400"
        >
          <option value="">Все бренды</option>
          {producers.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] gap-3 text-gray-500">
          <span className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          Загрузка каталога...
        </div>
      ) : shown.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">Ничего не найдено</div>
      ) : (
        <>
          <p className="text-xs text-gray-400 mb-2">Найдено: {filtered.length}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {shown.map((p) => (
              <ProductCard key={p.code} p={p} />
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
