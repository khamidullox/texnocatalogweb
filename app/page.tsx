'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PromoBanner from '@/app/components/PromoBanner';
import ProductCard from '@/app/components/ProductCard';

interface CatalogItem {
  code: string;
  name: string;
  producer: string;
  group: string;
  barcodes: string[];
  price: number;
}

const SECTIONS_COUNT = 8;
const ITEMS_PER_SECTION = 10;

export default function HomePage() {
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const sections = useMemo(() => {
    const byGroup = new Map<string, CatalogItem[]>();
    for (const p of products) {
      if (!p.group) continue;
      if (!byGroup.has(p.group)) byGroup.set(p.group, []);
      byGroup.get(p.group)!.push(p);
    }
    return [...byGroup.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, SECTIONS_COUNT)
      .map(([group, items]) => ({ group, items: items.slice(0, ITEMS_PER_SECTION) }));
  }, [products]);

  return (
    <div>
      <div className="mb-5">
        <PromoBanner />
      </div>

      {!loading && sections.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 mb-6">
          {sections.map(({ group }) => (
            <Link
              key={group}
              href={`/catalog?group=${encodeURIComponent(group)}`}
              className="shrink-0 bg-white hover:bg-red-50 hover:text-red-700 text-gray-600 text-xs font-medium px-3.5 py-2 rounded-full shadow-sm whitespace-nowrap"
            >
              {group}
            </Link>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] gap-3 text-gray-500">
          <span className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          Загрузка каталога...
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sections.map(({ group, items }) => (
            <div key={group}>
              <Link
                href={`/catalog?group=${encodeURIComponent(group)}`}
                className="flex items-center justify-between mb-2 group/h"
              >
                <h3 className="font-bold text-base group-hover/h:text-red-700">{group}</h3>
                <span className="text-gray-400 group-hover/h:text-red-600 text-lg">›</span>
              </Link>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {items.map((p) => (
                  <div key={p.code} className="w-40 sm:w-44 shrink-0">
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
