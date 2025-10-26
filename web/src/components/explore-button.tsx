/** biome-ignore-all lint/style/noMagicNumbers: Motion values */
'use client';

import { SearchIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Form from 'next/form';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { Button, buttonVariants } from './ui/button';
import { Field, FieldDescription } from './ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group';
import { Kbd, KbdGroup } from './ui/kbd';

export function ExploreButton() {
  const isMobile = useIsMobile();

  return isMobile ? (
    <div className="relative mt-4 flex h-16 items-center justify-center">
      <Link
        className={buttonVariants({ size: 'pill-lg', variant: 'outline' })}
        href="/explore"
      >
        <SearchIcon />
        Explore Directory
      </Link>
    </div>
  ) : (
    <AnimatedSearch />
  );
}

const macRegex = /Mac/;

function AnimatedSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const id = useId();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(macRegex.test(window.navigator.userAgent));
    }

    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !isExpanded) {
        e.preventDefault();
        setIsExpanded(true);
      }

      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () =>
      document.removeEventListener('keydown', handleKeyboardShortcut);
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      animate={{
        width: isExpanded ? 400 : 'auto',
        maxWidth: isExpanded ? '80vw' : '100vw',
      }}
      className="relative mt-4 flex h-16 items-center justify-center"
      layout
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="w-full"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="input-group"
            transition={{ duration: 0.15 }}
          >
            <Form action="/explore">
              <Field>
                <InputGroup>
                  <label aria-hidden htmlFor={id}>
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                  </label>
                  <InputGroupInput
                    aria-label="Search"
                    autoComplete="off"
                    autoFocus
                    name="q"
                    placeholder="Search for a merchant name…"
                    type="search"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      size="xs"
                      type="submit"
                      variant="secondary"
                    >
                      Search
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription className="hidden text-center md:block">
                  Hit <Kbd>Enter</Kbd> to search, or <Kbd>Esc</Kbd> to close.
                </FieldDescription>
              </Field>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="button"
            transition={{ duration: 0.15 }}
          >
            <Button onClick={handleToggle} size="pill-lg" variant="outline">
              <SearchIcon />
              Explore Directory
              <KbdGroup>
                <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
