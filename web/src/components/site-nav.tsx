'use client';

import { MenuIcon, XIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type ComponentProps, useEffect, useState } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { SearchInput } from './search-input';
import { Button, buttonVariants } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type NavItem<T extends string = string> = {
  href: T;
  label: string;
};

export function DesktopNav({ className, ...props }: ComponentProps<'nav'>) {
  const t = useTranslations('Header');

  const pathname = usePathname();
  const isMobile = useIsMobile();

  const navItems: NavItem<Route>[] = [
    { label: t('navigation.explore'), href: '/explore' },
    { label: t('navigation.about'), href: '#' },
  ];

  return pathname.startsWith('/explore') ? (
    <div className="order-1 flex w-full border-t p-4 lg:order-0 lg:border-none lg:p-0">
      <SearchInput placeholder={t('search.placeholder')} />
    </div>
  ) : (
    !isMobile && (
      <nav
        className={cn('hidden items-center gap-4 lg:flex', className)}
        {...props}
      >
        {navItems.map((item) => (
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
        ))}
      </nav>
    )
  );
}

export function MobileNav({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const t = useTranslations('Header');
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const navItems: NavItem<Route>[] = [
    { label: t('navigation.explore'), href: '/explore' },
    { label: t('navigation.about'), href: '#' },
  ];

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
    isMobile && (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-label="Menu"
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
          <div className="flex flex-col gap-4 overflow-auto px-6 py-4">
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
                {t('navigation.home')}
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
        </PopoverContent>
      </Popover>
    )
  );
}
