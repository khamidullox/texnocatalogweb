import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arzonchi',
  description: 'Каталог товаров и остатки по складам',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-100 antialiased">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link href="/" className="shrink-0">
              <Image src="/arzonchi-logo.png" alt="Arzonchi" width={220} height={56} className="h-11 sm:h-14 w-auto" priority />
            </Link>
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3.5 py-2 rounded-xl whitespace-nowrap"
            >
              ☰ Каталог
            </Link>
            <SearchBar />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
