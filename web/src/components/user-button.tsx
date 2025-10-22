import Link from 'next/link';

import { getUser } from '@/lib/data/users';
import { LogoutButton } from './logout-button';
import { Small } from './typography';
import { buttonVariants } from './ui/button';

export async function UserButton() {
  const user = await getUser();

  return (
    <div className="hidden items-center gap-4 md:flex">
      {user ? (
        <>
          <Small>👋 Hey, {user.name}!</Small>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link
            className={buttonVariants({ variant: 'secondary', size: 'pill' })}
            href="/login"
          >
            Login
          </Link>
          <Link className={buttonVariants({ size: 'pill' })} href="/">
            Get Started
          </Link>
        </>
      )}
    </div>
  );
}
