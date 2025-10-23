'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type ComponentProps, useCallback } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function ModeToggle({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const isMobile = useIsMobile();
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

      if (!document.startViewTransition) {
        setTheme(newTheme);
        return;
      }

      const { clientX, clientY } = event;
      const radius = Math.hypot(
        Math.max(clientX, window.innerWidth - clientX),
        Math.max(clientY, window.innerHeight - clientY)
      );

      const transition = document.startViewTransition(() => {
        setTheme(newTheme);
      });

      await transition.ready;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${clientX}px ${clientY}px)`,
            `circle(${radius}px at ${clientX}px ${clientY}px)`,
          ],
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    },
    [resolvedTheme, setTheme]
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn('relative', className)}
          onClick={toggleTheme}
          size={isMobile ? 'icon' : 'icon-sm'}
          variant="secondary"
          {...props}
        >
          <SunIcon className="dark:-rotate-90 rotate-0 scale-100 transition-all dark:scale-0" />
          <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle Theme</TooltipContent>
    </Tooltip>
  );
}
