import { listWarehouseStock } from '@/lib/products';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Список складов считается прямо из снимка остатков (агрегаты дешёвые).
// ?all=true — все склады; по умолчанию — только основные.
export async function GET(req: Request) {
  try {
    const all = new URL(req.url).searchParams.get('all') === 'true';
    const data = await listWarehouseStock(undefined, { all });
    return Response.json({ data });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
