import { NextRequest } from 'next/server';
import { getProductStock, getCachedCatalog, getStockMap } from '@/lib/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const [stock, catalog, stockMap] = await Promise.all([
      getProductStock(code),
      getCachedCatalog(),
      getStockMap(),
    ]);
    const item = catalog.find((c) => c.code === code);
    const similar = item
      ? catalog
          .filter((c) => c.group === item.group && c.code !== item.code)
          .slice(0, 12)
          .map((c) => ({ ...c, stock: stockMap.get(c.code) || 0 }))
      : [];

    return Response.json({
      ...stock,
      name: item?.name || '',
      producer: item?.producer || '',
      group: item?.group || '',
      price: item?.price || 0,
      similar,
    });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
