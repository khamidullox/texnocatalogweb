import { NextRequest } from 'next/server';
import { getProductPhotoSha, fetchProductPhotoBytes } from '@/lib/products';

export const runtime = 'nodejs';
// Без force-dynamic: Vercel Edge кеширует ответ по Cache-Control (картинка
// не меняется), повторные просмотры не бьют по Smartup/Firestore вообще.
export const maxDuration = 30;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const sha = await getProductPhotoSha(code);
    if (!sha) {
      return new Response(null, { status: 404 });
    }
    const photo = await fetchProductPhotoBytes(sha);
    if (!photo) {
      return new Response(null, { status: 404 });
    }
    return new Response(new Uint8Array(photo.bytes), {
      headers: {
        'Content-Type': photo.contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
