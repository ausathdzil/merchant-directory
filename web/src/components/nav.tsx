'use client';

import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, JSX } from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

type NavItem<T extends string = string> = {
  href: T;
  label: string;
  icon?: JSX.Element;
};

const navItems: NavItem<Route>[] = [
  { label: 'Explore', href: '#' },
  { label: 'About', href: '#' },
];

export function DesktopNav({ className, ...props }: ComponentProps<'nav'>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('-translate-x-1/2 absolute left-1/2', className)}
      {...props}
    >
      <ul className="flex items-center gap-4">
        {navItems.map((item, index) => (
          <Link
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              pathname === item.href && 'bg-accent'
            )}
            href={item.href}
            key={`${item.label}-${index}`}
          >
            {item.label}
          </Link>
        ))}
      </ul>
    </nav>
  );
}
