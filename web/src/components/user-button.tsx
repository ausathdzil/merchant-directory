import Link from 'next/link';
import type { ComponentProps } from 'react';

import { getUser } from '@/lib/data/users';
import { cn } from '@/lib/utils';
import { LogoutButton } from './logout-button';
import { Small } from './typography';
import { buttonVariants } from './ui/button';

export async function UserButton({
  className,
  ...props
}: ComponentProps<'div'>) {
  const user = await getUser();

  return (
    <div
      className={cn('hidden items-center gap-4 md:flex', className)}
      {...props}
    >
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
