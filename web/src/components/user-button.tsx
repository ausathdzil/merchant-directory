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
    <div className={cn('flex items-center gap-4', className)} {...props}>
      {user ? (
        <>
          <Small>👋 Hey, {user.name}!</Small>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'pill' }),
              'hidden md:flex'
            )}
            href="/login"
          >
            Login
          </Link>
          <Link className={buttonVariants({ size: 'pill' })} href="/register">
            Get Started
          </Link>
        </>
      )}
    </div>
  );
}
