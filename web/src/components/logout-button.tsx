'use client';

import type { ComponentProps } from 'react';

import { logout } from '@/lib/actions/auth';
import { Button } from './ui/button';

export function LogoutButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      className={className}
      onClick={logout}
      {...props}
      size="pill"
      variant="destructive"
    >
      Logout
    </Button>
  );
}
