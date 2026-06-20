'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface StockRow {
  warehouse_name: string;
  quantity: number;
}

interface ProductStock {
  rows: StockRow[];
  total: number;
  wholesale_price: number;
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

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        {photoOk && (
          <img
            src={`/api/products/${encodeURIComponent(code)}/photo`}
            alt={code}
            onError={() => setPhotoOk(false)}
            className="w-full max-h-64 object-contain mb-3 rounded-lg bg-gray-50"
          />
        )}
        <h2 className="font-bold text-base leading-snug">Товар {code}</h2>
        {stock && stock.wholesale_price > 0 && (
          <p className="mt-2 text-sm">
            💵 Оптовая цена:{' '}
            <strong className="text-emerald-600">{stock.wholesale_price.toLocaleString('ru-RU')} сум</strong>
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">📦 Остатки по складам</span>
          {stock && (
            <span className="text-sm">
              доступно: <strong className="text-green-600">{stock.total}</strong> шт.
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-gray-500 text-sm">
            <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            Загрузка остатков...
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : stock && stock.rows.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {stock.rows.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                <span className="truncate">{r.warehouse_name}</span>
                <span className="font-bold whitespace-nowrap ml-2">{r.quantity} шт.</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8 text-sm">Нет остатков на складах</div>
        )}
      </div>
    </div>
  );
}
