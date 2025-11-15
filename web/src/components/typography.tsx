import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function Title({ className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-balance text-center font-medium text-4xl tracking-tight md:text-5xl',
        className
      )}
      {...props}
    />
  );
}

export function Heading({ className, ...props }: ComponentProps<'h2'>) {
  return (
    <h2
      className={cn(
        'scroll-m-20 font-semibold text-lg tracking-tight first:mt-0 md:text-3xl',
        className
      )}
      {...props}
    />
  );
}

export function Subheading({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'scroll-m-20 font-semibold text-2xl tracking-tight',
        className
      )}
      {...props}
    />
  );
}

export function Text({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('not-first:mt-6 leading-7', className)} {...props} />;
}

export function Blockquote({
  className,
  ...props
}: ComponentProps<'blockquote'>) {
  return (
    <blockquote
      className={cn('mt-6 border-primary/50 border-l-2 pl-6 italic', className)}
      {...props}
    />
  );
}

export function UnorderedList({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)} {...props} />
  );
}

export function Large({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('font-semibold text-lg', className)} {...props} />;
}

export function Small({ className, ...props }: ComponentProps<'small'>) {
  return (
    <small
      className={cn('font-medium text-sm leading-none', className)}
      {...props}
    />
  );
}

export function Muted({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props} />
  );
}
