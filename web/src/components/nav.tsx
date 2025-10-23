'use client';

import { MenuIcon, XIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  type ComponentProps,
  Suspense,
  useEffect,
  useState,
  ViewTransition,
} from 'react';

import { useUser } from '@/hooks/use-user';
import { logout } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { SearchInput } from './search-input';
import { Button, buttonVariants } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Skeleton } from './ui/skeleton';

type NavItem<T extends string = string> = {
  href: T;
  label: string;
};

const navItems: NavItem<Route>[] = [
  { label: 'Explore', href: '/explore' },
  { label: 'About', href: '#' },
];

export function DesktopNav({ className, ...props }: ComponentProps<'nav'>) {
  const pathname = usePathname();

  return pathname.startsWith('/explore') ? (
    <div className="flex flex-1 items-center justify-center gap-4">
      <ViewTransition name="explore">
        <Link
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            pathname === '/explore' && 'bg-accent',
            'hidden xl:flex'
          )}
          href="/explore"
        >
          Explore
        </Link>
      </ViewTransition>
      <Suspense fallback={<Skeleton className="mx-auto h-9 w-full max-w-lg" />}>
        <SearchInput
          className="mx-auto max-w-lg"
          placeholder="Search merchant name or keywords…"
        />
      </Suspense>
    </div>
  ) : (
    <div className="-translate-x-1/2 absolute left-1/2">
      <nav
        className={cn('hidden items-center gap-4 md:flex', className)}
        {...props}
      >
        {navItems.map((item) => {
          const link = (
            <Link
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                pathname === item.href && 'bg-accent'
              )}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          );

          return item.label === 'Explore' || item.href === '/explore' ? (
            <ViewTransition key={item.label} name="explore">
              {link}
            </ViewTransition>
          ) : (
            link
          );
        })}
      </nav>
    </div>
  );
}

export function MobileNav({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Force close popover when pathname changes
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [pathname]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn('relative, overflow-hidden', className)}
          size="icon"
          variant="ghost"
          {...props}
        >
          <MenuIcon
            className={cn(
              'absolute transition-all duration-200',
              open
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100'
            )}
          />
          <XIcon
            className={cn(
              'absolute transition-all duration-200',
              open
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        alignOffset={-16}
        className="no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur duration-100"
        side="bottom"
        sideOffset={14}
      >
        <div className="flex flex-col gap-12 overflow-auto px-8 py-4">
          <div className="flex flex-col gap-4">
            <div className="font-medium text-muted-foreground">Menu</div>
            <nav className="flex flex-col gap-3">
              <Link
                className="font-medium text-2xl"
                href="/"
                onClick={() => {
                  setOpen(false);
                  router.push('/');
                }}
              >
                Home
              </Link>
              {navItems.map((item) => (
                <Link
                  className="font-medium text-2xl"
                  href={item.href}
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            {user ? (
              <button
                className="text-left font-medium text-2xl"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                type="button"
              >
                Logout
              </button>
            ) : (
              <nav className="flex flex-col gap-3">
                <Link
                  className="font-medium text-2xl"
                  href="/login"
                  onClick={() => {
                    setOpen(false);
                    router.push('/login');
                  }}
                >
                  Login
                </Link>
                <Link
                  className="font-medium text-2xl"
                  href="/register"
                  onClick={() => {
                    setOpen(false);
                    router.push('/login');
                  }}
                >
                  Register
                </Link>
              </nav>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
