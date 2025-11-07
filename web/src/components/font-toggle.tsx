'use client';

import { TypeIcon, TypeOutlineIcon } from 'lucide-react';
import { type ComponentProps, useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type FontToggleProps = {
  fontToggleLabel: string;
} & ComponentProps<typeof Button>;

export function FontToggle({
  fontToggleLabel,
  className,
  ...props
}: FontToggleProps) {
  const [font, setFont] = useState<'default' | 'open-dyslexic'>('default');

  useEffect(() => {
    const savedFont = localStorage.getItem('font');
    const currentFont =
      savedFont === 'open-dyslexic' ? 'open-dyslexic' : 'default';
    setFont(currentFont);

    if (currentFont === 'open-dyslexic') {
      document.documentElement.setAttribute('data-font', 'open-dyslexic');
    } else {
      document.documentElement.removeAttribute('data-font');
    }
  }, []);

  const toggleFont = useCallback(() => {
    const newFont = font === 'open-dyslexic' ? 'default' : 'open-dyslexic';

    if (newFont === 'open-dyslexic') {
      localStorage.setItem('font', 'open-dyslexic');
      document.documentElement.setAttribute('data-font', 'open-dyslexic');
    } else {
      localStorage.removeItem('font');
      document.documentElement.removeAttribute('data-font');
    }

    setFont(newFont);
  }, [font]);

  return (
    <Button
      aria-label={fontToggleLabel}
      className={cn('relative', className)}
      onClick={toggleFont}
      size="icon"
      variant="secondary"
      {...props}
    >
      <TypeIcon
        className={cn(
          'scale-100 transition-all',
          font === 'open-dyslexic' && 'scale-0'
        )}
      />
      <TypeOutlineIcon
        className={cn(
          'absolute scale-0 transition-all',
          font === 'open-dyslexic' && 'scale-100'
        )}
      />
    </Button>
  );
}
