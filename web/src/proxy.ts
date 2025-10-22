import { type NextRequest, NextResponse } from 'next/server';
import { getUser } from './lib/data/users';

const authRoute = ['/login', '/register'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthRoute = authRoute.includes(path);

  const user = await getUser();

  if (isAuthRoute && user?.id) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
