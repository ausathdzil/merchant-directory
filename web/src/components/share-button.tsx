'use client';

import { Share2Icon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

export function ShareButton({ ...props }: ComponentProps<typeof Button>) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Button {...props} onClick={handleShare} size="icon-lg" variant="outline">
      <Share2Icon />
    </Button>
  );
}
