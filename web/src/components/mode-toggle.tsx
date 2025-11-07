'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type ComponentProps, useCallback } from 'react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type ModeToggleProps = {
  modeToggleLabel: string;
} & ComponentProps<typeof Button>;

export function ModeToggle({
  modeToggleLabel,
  className,
  ...props
}: ModeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';

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
    [theme, setTheme]
  );

  return (
    <Button
      aria-label={modeToggleLabel}
      className={cn('relative', className)}
      onClick={toggleTheme}
      size="icon"
      variant="secondary"
      {...props}
    >
      <SunIcon className="dark:-rotate-90 rotate-0 scale-100 transition-all dark:scale-0" />
      <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
