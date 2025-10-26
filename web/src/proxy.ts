import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';

import { locales } from '../global';
import { setLocale } from './lib/actions/locale';
import { getUser } from './lib/data/users';

function getLocale(req: NextRequest) {
  const headers = {
    'accept-language': req.headers.get('accept-language') || 'en-US,en;q=0.5',
  };
  const languages = new Negotiator({ headers }).languages();
  const defaultLocale = 'id';

  return match(languages, locales, defaultLocale);
}

const authRoute = ['/login', '/register'];

export default async function proxy(req: NextRequest) {
  const locale = getLocale(req) as (typeof locales)[number];
  await setLocale(locale);

  const path = req.nextUrl.pathname;
  const isAuthRoute = authRoute.includes(path);

  const user = await getUser();

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
