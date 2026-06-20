'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [value, setValue] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(value.trim() ? `/catalog?q=${encodeURIComponent(value.trim())}` : '/catalog');
  }

  return (
    <form onSubmit={submit} className="flex-1 max-w-xl">
      <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-violet-300">
        <span className="text-gray-400">🔍</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Поиск товаров и категорий"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>
    </form>
  );
}
