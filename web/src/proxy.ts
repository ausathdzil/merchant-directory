import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { getUser } from './lib/data/users';

const authRoute = ['/login', '/register'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthRoute = authRoute.includes(path);

  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  const user = await getUser(session);

  if (isAuthRoute && user?.id) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
