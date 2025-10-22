import 'server-only';
import { cookies } from 'next/headers';

export async function createSession(jwt: string) {
  // biome-ignore lint/style/noMagicNumbers: 1 year
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 + 1000);
  const cookieStore = await cookies();

  cookieStore.set('session', jwt, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
