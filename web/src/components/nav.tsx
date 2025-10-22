'use client';

import { MenuIcon, XIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ComponentProps, useEffect, useState } from 'react';

import { useUser } from '@/hooks/use-user';
import { logout } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { SearchInput } from './search-input';
import { Button, buttonVariants } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type NavItem<T extends string = string> = {
  href: T;
  label: string;
};

const navItems: NavItem<Route>[] = [
  { label: 'Explore', href: '/explore' },
  // { label: 'About', href: '#' },
];

export function DesktopNav({ className, ...props }: ComponentProps<'div'>) {
  const pathname = usePathname();

  return (
    <div className={cn('flex items-center gap-4', className)} {...props}>
      <nav className={cn('hidden items-center gap-4 md:flex')}>
        {navItems.map((item) => (
          <Link
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              pathname === item.href && 'bg-accent'
            )}
            href={item.href}
            key={`${item.label}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {pathname.startsWith('/explore') && (
        <SearchInput
          className="max-w-lg"
          placeholder="Search merchant names or keywords…"
        />
      )}
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

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button className={className} size="icon-sm" variant="ghost" {...props}>
          {open ? <XIcon /> : <MenuIcon />}
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
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              {navItems.map((item) => (
                <Link
                  className="font-medium text-2xl"
                  href={item.href}
                  key={item.label}
                  onClick={() => setOpen(false)}
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
