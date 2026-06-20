'use client';

import { useState } from 'react';

// Статичные промо-баннеры — пока нет источника акций в Smartup,
// редактируются прямо здесь (текст/цвета/ссылка на фильтр каталога).
const BANNERS = [
  {
    title: 'Климатическая техника',
    subtitle: 'Кондиционеры, обогреватели и вентиляторы в одном каталоге',
    href: '/catalog?q=кондиционер',
    from: 'from-blue-500',
    to: 'to-cyan-400',
    emoji: '❄️',
  },
  {
    title: 'Крупная бытовая техника',
    subtitle: 'Холодильники, морозильники, стиральные машины',
    href: '/catalog?q=morozilnik',
    from: 'from-violet-500',
    to: 'to-purple-400',
    emoji: '🧊',
  },
  {
    title: 'Вся техника со склада',
    subtitle: 'Актуальные остатки по всем филиалам — каждый день',
    href: '/catalog',
    from: 'from-amber-500',
    to: 'to-orange-400',
    emoji: '🚚',
  },
];

export default function PromoBanner() {
  const [i, setI] = useState(0);
  const b = BANNERS[i];
  const prev = () => setI((v) => (v - 1 + BANNERS.length) % BANNERS.length);
  const next = () => setI((v) => (v + 1) % BANNERS.length);

  return (
    <div className="relative">
      <a
        href={b.href}
        className={`block h-44 sm:h-56 rounded-2xl bg-gradient-to-br ${b.from} ${b.to}
                    text-white p-6 sm:p-8 flex flex-col justify-end shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
      >
        <span className="absolute top-4 right-6 text-6xl sm:text-7xl opacity-80">{b.emoji}</span>
        <div className="font-bold text-xl sm:text-2xl leading-tight">{b.title}</div>
        <div className="text-sm opacity-90 leading-tight mt-1 max-w-md">{b.subtitle}</div>
      </a>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          prev();
        }}
        aria-label="Назад"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow text-gray-700"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          next();
        }}
        aria-label="Вперёд"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow text-gray-700"
      >
        ›
      </button>

      <div className="flex justify-center gap-1.5 mt-2.5">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Слайд ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-violet-600' : 'w-1.5 bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
