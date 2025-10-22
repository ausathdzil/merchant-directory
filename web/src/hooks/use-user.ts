'use client';

import { createContext, useContext } from 'react';

import type { User } from '@/lib/types/user';

export const UserContext = createContext<User | null | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
