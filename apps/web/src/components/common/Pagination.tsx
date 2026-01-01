import { ButtonGroup, IconButton } from '@/theming/components';
import { Pagination as ChakraPagination, PaginationRootProps } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { JSX } from 'react';

interface PaginationProps extends PaginationRootProps {
  count: number;
  pageSize: number;
  page: number;
  onPageChange: (details: { page: number }) => void;
}

export function Pagination({
  count,
  pageSize,
  page,
  onPageChange,
  ...rest
}: PaginationProps): JSX.Element {
  const totalPages = Math.ceil(count / pageSize);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return (
    <ChakraPagination.Root
      count={count}
      pageSize={pageSize}
      page={page}
      onPageChange={onPageChange}
      {...rest}
    >
      <ButtonGroup size={'sm'} variant={'outline'}>
        {hasPrevPage && (
          <ChakraPagination.PrevTrigger asChild>
            <IconButton>
              <ChevronLeft size={16} />
            </IconButton>
          </ChakraPagination.PrevTrigger>
        )}

        <ChakraPagination.Items
          render={pageItem => (
            <IconButton
              key={pageItem.value}
              variant={{ base: 'outline', _selected: 'solid' }}
            >
              {pageItem.value}
            </IconButton>
          )}
        />

        {hasNextPage && (
          <ChakraPagination.NextTrigger asChild>
            <IconButton>
              <ChevronRight size={16} />
            </IconButton>
          </ChakraPagination.NextTrigger>
        )}
      </ButtonGroup>
    </ChakraPagination.Root>
  );
}
