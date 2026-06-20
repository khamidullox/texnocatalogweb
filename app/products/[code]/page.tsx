'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/app/components/ProductCard';
import RequestStockButton from '@/app/components/RequestStockButton';

interface SimilarItem {
  code: string;
  name: string;
  producer: string;
  group: string;
  price: number;
  stock: number;
}

interface ProductStock {
  total: number;
  wholesale_price: number;
  name: string;
  producer: string;
  group: string;
  price: number;
  similar: SimilarItem[];
}

export default function ProductDetailPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const [stock, setStock] = useState<ProductStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoOk, setPhotoOk] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/products/${encodeURIComponent(code)}/stock`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) throw new Error(j.error);
        if (alive) setStock(j);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [code]);

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="px-3 py-1.5 bg-white hover:bg-gray-200 rounded-lg text-sm text-gray-600 mb-3"
      >
        ← Назад
      </button>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 grid sm:grid-cols-[220px_1fr] gap-4">
        <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          {photoOk ? (
            <img
              src={`/api/products/${encodeURIComponent(code)}/photo`}
              alt={code}
              onError={() => setPhotoOk(false)}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-5xl text-gray-300">📦</span>
          )}
        </div>

        <div className="flex flex-col">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
              <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              Загрузка...
            </div>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <>
              <h2 className="font-bold text-lg leading-snug">{stock?.name || `Товар ${code}`}</h2>
              <div className="text-sm text-gray-400 mt-1">
                Код {code}
                {stock?.producer && ` · ${stock.producer}`}
                {stock?.group && ` · ${stock.group}`}
              </div>

              {stock && stock.price > 0 && (
                <p className="mt-3 text-2xl font-bold text-emerald-700">
                  {stock.price.toLocaleString('ru-RU')} сум
                </p>
              )}
              {stock && stock.wholesale_price > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  Оптовая цена: {stock.wholesale_price.toLocaleString('ru-RU')} сум
                </p>
              )}

              <div className="mt-3">
                {stock && stock.total > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                    ✅ В наличии: {stock.total} шт.
                  </span>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium text-gray-400">Нет в наличии</span>
                    <RequestStockButton code={code} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {stock && stock.similar.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Похожие товары</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {stock.similar.map((s) => (
              <div key={s.code} className="w-40 sm:w-44 shrink-0">
                <ProductCard p={s} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
