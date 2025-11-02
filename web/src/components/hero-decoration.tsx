'use client';

import {
  CoffeeIcon,
  ShoppingBagIcon,
  StoreIcon,
  UtensilsIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

export function HeroDecorations({
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-4', className)} {...props}>
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
        }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{
          duration: 0.4,
          scale: {
            type: 'spring',
            visualDuration: 0.4,
            bounce: 0.5,
          },
        }}
      >
        <StoreIcon className="float-down size-12 stroke-primary" />
      </motion.div>
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
        }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{
          duration: 0.4,
          scale: {
            type: 'spring',
            visualDuration: 0.5,
            bounce: 0.5,
          },
        }}
      >
        <ShoppingBagIcon className="float-down size-12 stroke-emerald-700" />
      </motion.div>
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
        }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{
          duration: 0.4,
          scale: {
            type: 'spring',
            visualDuration: 0.6,
            bounce: 0.5,
          },
        }}
      >
        <CoffeeIcon className="float-down size-12 stroke-yellow-500" />
      </motion.div>
      <motion.div
        animate={{
          opacity: 1,
          scale: 1,
        }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{
          duration: 0.4,
          scale: {
            type: 'spring',
            visualDuration: 0.7,
            bounce: 0.5,
          },
        }}
      >
        <UtensilsIcon className="float-down size-12 stroke-rose-500" />
      </motion.div>
    </div>
  );
}
