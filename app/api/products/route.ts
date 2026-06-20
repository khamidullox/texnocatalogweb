import { getCachedCatalog, getPhotoCodeSet } from '@/lib/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Каталог читается из Firestore-кэша (быстро). В фоне обновляется из Smartup.
// Товары с уже найденным фото идут первыми — карточки в начале списка не пустые.
export async function GET() {
  try {
    const [catalog, photoCodes] = await Promise.all([getCachedCatalog(), getPhotoCodeSet()]);
    const data = [...catalog].sort((a, b) => {
      const aHas = photoCodes.has(a.code) ? 1 : 0;
      const bHas = photoCodes.has(b.code) ? 1 : 0;
      return bHas - aHas;
    });
    return Response.json({ data });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
