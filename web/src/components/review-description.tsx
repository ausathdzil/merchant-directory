'use client';

import { useEffect, useRef, useState } from 'react';
import { ItemDescription } from './ui/item';

export function ReviewText({ text }: { text: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    el.classList.remove('line-clamp-2');
    el.classList.add('line-clamp-none');

    const fullHeight = el.scrollHeight;

    el.classList.remove('line-clamp-none');
    el.classList.add('line-clamp-2');

    requestAnimationFrame(() => {
      const clampedHeight = el.clientHeight;
      setIsClamped(fullHeight > clampedHeight + 1);
    });
  }, []);

  return (
    <div>
      <ItemDescription
        className={isExpanded ? 'line-clamp-none' : 'line-clamp-2'}
        ref={ref}
      >
        {text}
      </ItemDescription>
      {isClamped && (
        <button
          className="hover:text-primary"
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
