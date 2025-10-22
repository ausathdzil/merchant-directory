'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type ComponentProps, useCallback } from 'react';

import { Button } from './ui/button';
import { DropdownMenu } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function ModeToggle({ ...props }: ComponentProps<typeof Button>) {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleTheme}
            size="icon-sm"
            variant="secondary"
            {...props}
          >
            <SunIcon className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle Theme</TooltipContent>
      </Tooltip>
    </DropdownMenu>
  );
}
