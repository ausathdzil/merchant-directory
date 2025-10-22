'use client';

import { use } from 'react';

import { UserContext } from '@/hooks/use-user';
import type { User } from '@/lib/types/user';

type UserProviderProps = {
  children: React.ReactNode;
  userPromise: Promise<User | null>;
};

export function UserProvider({ children, userPromise }: UserProviderProps) {
  const user = use(userPromise);

  return <UserContext value={user}>{children}</UserContext>;
}
