'use client';

import type { Route } from 'next';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ComponentProps } from 'react';

import type { PaginationMeta } from '@/lib/types/merchant';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

type MerchantPaginationProps = {
  paginationMeta: PaginationMeta;
} & ComponentProps<typeof Pagination>;

function generatePagination(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '…', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '…', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '…',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '…',
    totalPages,
  ];
}

export function MerchantPagination({
  paginationMeta,
  ...props
}: MerchantPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;
  const allPages = generatePagination(currentPage, paginationMeta.total_pages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}` as Route;
  };

  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={!paginationMeta.has_previous}
            className={
              paginationMeta.has_previous
                ? ''
                : 'pointer-events-none opacity-50'
            }
            href={createPageUrl(currentPage - 1)}
            tabIndex={paginationMeta.has_previous ? undefined : -1}
          />
        </PaginationItem>
        {allPages.map((page) =>
          page === '…' ? (
            <PaginationItem key={`ellipsis-${page}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageUrl(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            aria-disabled={!paginationMeta.has_next}
            className={
              paginationMeta.has_next ? '' : 'pointer-events-none opacity-50'
            }
            href={createPageUrl(currentPage + 1)}
            tabIndex={paginationMeta.has_next ? undefined : -1}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
