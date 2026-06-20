'use client';

import { useState } from 'react';
import Link from 'next/link';
import RequestStockButton from '@/app/components/RequestStockButton';

export interface CardProduct {
  code: string;
  name: string;
  producer: string;
  group: string;
  price: number;
  stock?: number;
}

export default function ProductCard({ p }: { p: CardProduct }) {
  const [photoOk, setPhotoOk] = useState(true);
  const outOfStock = (p.stock ?? 0) <= 0;

  return (
    <Link
      href={`/products/${encodeURIComponent(p.code)}`}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full relative ${
        outOfStock ? 'opacity-60 grayscale-[35%]' : ''
      }`}
    >
      {outOfStock && (
        <span className="absolute top-1.5 left-1.5 z-10 text-[10px] font-medium bg-gray-700/80 text-white px-1.5 py-0.5 rounded">
          Нет в наличии
        </span>
      )}
      <div className="h-36 sm:h-40 w-full bg-gray-50 flex items-center justify-center shrink-0">
        {photoOk ? (
          <img
            src={`/api/products/${encodeURIComponent(p.code)}/photo`}
            alt={p.name}
            loading="lazy"
            onError={() => setPhotoOk(false)}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-3xl text-gray-300">📦</span>
        )}
      </div>
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <div className="text-[12px] leading-tight font-medium line-clamp-2 min-h-[2.2em]">{p.name || '—'}</div>
        {p.producer && <div className="text-[10px] text-gray-400 truncate">{p.producer}</div>}
        <div className="mt-auto pt-1">
          {outOfStock ? (
            <RequestStockButton code={p.code} compact />
          ) : p.price > 0 ? (
            <span className="text-[13px] font-bold text-emerald-700">{p.price.toLocaleString('ru-RU')} сум</span>
          ) : (
            <span className="text-[11px] text-gray-400">Цена по запросу</span>
          )}
        </div>
      </div>
    </Link>
  );
}
