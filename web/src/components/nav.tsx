'use client';

import { MenuIcon, XIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ComponentProps, type JSX, useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { logout } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

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

export function MobileNav({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (href: Route) => {
    router.push(href);
    setOpen(false);
  };

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
        <div className="flex flex-col gap-12 overflow-auto px-11 py-6">
          <div className="flex flex-col gap-4">
            <div className="font-medium text-muted-foreground">Menu</div>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  className="font-medium text-2xl"
                  href={item.href}
                  key={item.label}
                  onClick={() => handleNavigate(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <MobileUserButton handleNavigate={handleNavigate} setOpen={setOpen} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MobileUserButton({
  handleNavigate,
  setOpen,
}: {
  handleNavigate: (href: Route) => void;
  setOpen: (value: boolean) => void;
}) {
  const user = useUser();

  return (
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
            onClick={() => handleNavigate('/login')}
          >
            Login
          </Link>
          <Link
            className="font-medium text-2xl"
            href="/register"
            onClick={() => handleNavigate('/register')}
          >
            Register
          </Link>
        </nav>
      )}
    </div>
  );
}
