'use client';

import Image from 'next/image';
import { type ComponentProps, useRef } from 'react';
import { Item, ItemGroup } from '@/components/ui/item';
import type { MerchantPhotosResponse } from '@/lib/types/merchant';

export function MerchantPhotos({
  merchantName,
  photos,
}: {
  merchantName: string;
  photos: MerchantPhotosResponse;
}) {
  const primaryPhoto = photos.find((photo) => photo.is_primary);
  const additionalPhotos = photos.filter((photo) => !photo.is_primary);

  return (
    <div className="grid gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-card">
        {primaryPhoto?.width && primaryPhoto.height && (
          <ImageZoom
            alt={merchantName}
            className="size-full cursor-zoom-in rounded-lg object-contain"
            height={primaryPhoto.height}
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 66vw"
            src={primaryPhoto.vercel_blob_url}
            width={primaryPhoto.width}
          />
        )}
      </div>
      {additionalPhotos.length > 0 && (
        <ItemGroup className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
          {additionalPhotos.map((photo) => (
            <li className="list-none" key={photo.id}>
              <Item className="aspect-square overflow-hidden" variant="outline">
                {photo.width && photo.height && (
                  <ImageZoom
                    alt={`${merchantName} - Photo ${photo.order}`}
                    className="size-full cursor-zoom-in object-cover"
                    height={photo.height}
                    loading="eager"
                    src={photo.vercel_blob_url}
                    width={photo.width}
                  />
                )}
              </Item>
            </li>
          ))}
        </ItemGroup>
      )}
    </div>
  );
}

function ImageZoom(props: ComponentProps<typeof Image>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleOpen = () => {
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    dialogRef.current?.close();
  };

  const handleKeyDown = (handler: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  return (
    <>
      <Image
        {...props}
        aria-label={`Zoom ${props.alt}`}
        onClick={handleOpen}
        onKeyDown={handleKeyDown(handleOpen)}
        role="button"
        tabIndex={0}
      />
      <dialog
        className="h-screen max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
        ref={dialogRef}
      >
        <div className="grid size-full place-items-center">
          <button
            aria-label="Close zoomed image"
            className="grid size-full cursor-zoom-out place-items-center bg-transparent p-0 focus-visible:outline-none"
            onClick={handleClose}
            onKeyDown={handleKeyDown(handleClose)}
            type="button"
          >
            <Image
              {...props}
              className="max-h-[95vh] min-h-[50vh] w-auto max-w-[95vw] object-contain"
            />
          </button>
        </div>
      </dialog>
    </>
  );
}
