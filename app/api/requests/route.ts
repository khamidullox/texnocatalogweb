import { NextRequest } from 'next/server';
import { getDb } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Заявки "сообщите, когда появится" — телефон клиента + код товара.
// Менеджер смотрит коллекцию stock_requests в Firestore и сам связывается.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = String(body?.code ?? '').trim();
    const phone = String(body?.phone ?? '').trim();

    if (!code || !phone) {
      return Response.json({ error: 'code и phone обязательны' }, { status: 400 });
    }
    if (phone.length < 5 || phone.length > 30) {
      return Response.json({ error: 'Некорректный номер телефона' }, { status: 400 });
    }

    const db = getDb();
    await db.collection('stock_requests').add({
      code,
      phone,
      created_at: Date.now(),
      done: false,
    });

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
