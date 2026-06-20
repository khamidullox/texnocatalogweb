'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface CardProduct {
  code: string;
  name: string;
  producer: string;
  group: string;
  price: number;
}

export default function ProductCard({ p }: { p: CardProduct }) {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <Link
      href={`/products/${encodeURIComponent(p.code)}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full"
    >
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
          {p.price > 0 ? (
            <span className="text-[13px] font-bold text-emerald-700">{p.price.toLocaleString('ru-RU')} сум</span>
          ) : (
            <span className="text-[11px] text-gray-400">Цена по запросу</span>
          )}
        </div>
      </div>
    </Link>
  );
}
