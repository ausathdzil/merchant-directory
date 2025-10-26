'use client';

import { type ComponentProps, useTransition } from 'react';

import { logout } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';

export function LogoutButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => await logout());
  };

  return (
    <Button
      className={cn('min-w-[71px]', className)}
      {...props}
      disabled={isPending}
      onClick={handleLogout}
      size="pill"
      type="submit"
      variant="destructive"
    >
      {isPending ? <Spinner /> : 'Logout'}
    </Button>
  );
}
