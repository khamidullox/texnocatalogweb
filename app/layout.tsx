import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Catalog Backend',
  description: 'Каталог товаров и остатки по складам',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-100 antialiased">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link href="/" className="font-bold text-lg">📚 Каталог</Link>
            <Link href="/warehouses" className="text-sm text-gray-500 hover:text-gray-800">🏬 Склады</Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
