import { Listbox, Pagination, Select } from '@/components/common';
import { ModCard, ModRow } from '@/components/mods';
import { useCategories } from '@/hooks/api/useCategoriesHooks';
import { useGameVersions } from '@/hooks/api/useGameVersionsHooks';
import { useMods } from '@/hooks/api/useModsHooks';
import {
  ButtonGroup,
  IconButton,
  Input,
  Text,
} from '@/theming/components';
import {
  Box,
  Container,
  createListCollection,
  Flex,
  Grid,
  ListCollection,
  Stack,
} from '@chakra-ui/react';
import { ModSortBy } from '@craftedtales/api/schemas/mods';
import { createFileRoute } from '@tanstack/react-router';
import { Grid as GridIcon, List } from 'lucide-react';
import { JSX, useState } from 'react';
import { SelectItem } from 'src/components/common/Select';
import { useDebounce } from '../../hooks/useDebounce';

export const Route = createFileRoute('/mods/')({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGameVersions, setSelectedGameVersions] = useState<string[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<ModSortBy>(ModSortBy.CreatedAt);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch categories and game versions from API
  const { data: categories } = useCategories();
  const { data: gameVersions } = useGameVersions();

  // Create collections for filters
  const categoriesCollection = createListCollection({
    items: categories?.data.map(c => ({ label: c.name, value: c.id })) ?? [],
  });

  const gameVersionsCollection = createListCollection({
    items: gameVersions?.data.map(v => ({ label: v.name, value: v.id })) ?? [],
  });

  // Fetch mods with all filters applied
  const { data: modsData, isLoading, error } = useMods({
    categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    gameVersionIds: selectedGameVersions.length > 0 ? selectedGameVersions : undefined,
    search: debouncedSearch || undefined,
    sortBy,
    page: currentPage,
    limit: pageSize,
  });

  const sortByOptions: ListCollection<SelectItem<ModSortBy>> = createListCollection({
    items: [
      { label: 'Created', value: ModSortBy.CreatedAt },
      { label: 'Updated', value: ModSortBy.UpdatedAt },
      { label: 'Downloads', value: ModSortBy.Downloads },
      { label: 'Likes', value: ModSortBy.Likes },
    ],
  });

  const pageSizeOptions: ListCollection<SelectItem> = createListCollection({
    items: [
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
    ],
  });

  return (
    <Container maxW={'container.xl'} px={{ base: '4', lg: '32' }} py={20}>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 3fr' }} gap={6} py={8}>
        {/* Left Column - Filters */}
        <Box>
          <Text fontSize={'lg'} fontWeight={'bold'} mb={4}>
            {'Filters'}
          </Text>

          {/* Category Filter */}
          <Box mb={6}>
            <Listbox
              collection={categoriesCollection}
              value={selectedCategories}
              onValueChange={details => setSelectedCategories(details.value)}
              selectionMode={'multiple'}
              label={'Categories'}
            />
          </Box>

          {/* Game Version Filter */}
          <Box>
            <Listbox
              collection={gameVersionsCollection}
              value={selectedGameVersions}
              onValueChange={details => setSelectedGameVersions(details.value)}
              selectionMode={'multiple'}
              label={'Game Versions'}
            />
          </Box>
        </Box>

        {/* Right Column - Content */}
        <Box>
          {/* Search Bar */}
          <Box mb={4}>
            <Input
              placeholder={'Search mods...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              size={'lg'}
            />
          </Box>

          {/* Controls Row */}
          <Flex
            gap={4}
            mb={6}
            flexWrap={'wrap'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            {/* View Toggle */}
            <ButtonGroup
              size={'sm'}
              variant={'outline'}
              attached
            >
              <IconButton
                variant={viewMode === 'grid' ? 'solid' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <GridIcon size={16} />
              </IconButton>
              <IconButton
                variant={viewMode === 'list' ? 'solid' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </IconButton>
            </ButtonGroup>

            {/* Sort By Select */}
            <Select
              collection={sortByOptions}
              size={'sm'}
              width={'auto'}
              value={[sortBy]}
              // controlled cast look how to propertly type this
              // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
              onValueChange={details => setSortBy(details.value[0] as ModSortBy)}
            />

            {/* Page Size */}
            <Select
              collection={pageSizeOptions}
              size={'sm'}
              width={'auto'}
              value={[pageSize.toString()]}
              onValueChange={details => setPageSize(Number(details.value[0]))}
            />

            {/* Pagination */}
            <Flex
              gap={2}
              alignItems={'center'}
              flex={'1'}
              justifyContent={'flex-end'}
              flexWrap={'wrap'}
            >
              <Pagination
                count={modsData?.totalItems ?? 0}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={e => setCurrentPage(e.page)}
              />
            </Flex>
          </Flex>

          {/* Mods List/Grid */}
          <Box mb={6}>
            {viewMode === 'grid'
              ? (
                  <Grid
                    templateColumns={{
                      base: '1fr',
                      sm: 'repeat(1, 1fr)',
                      lg: 'repeat(2, 1fr)',
                    }}
                    gap={6}
                  >
                    {modsData?.data.map(mod => (
                      <ModCard key={mod.id} mod={mod} />
                    ))}
                  </Grid>
                )
              : (
                  <Stack gap={4}>
                    {modsData?.data.map(mod => (
                      <ModRow key={mod.id} mod={mod} />
                    ))}
                  </Stack>
                )}
          </Box>

          {/* Bottom Pagination */}
          <Flex justifyContent={'flex-end'}>
            <Pagination
              count={modsData?.totalItems ?? 0}
              pageSize={pageSize}
              page={currentPage}
              onPageChange={e => setCurrentPage(e.page)}
            />
          </Flex>
        </Box>
      </Grid>
    </Container>
  );
}
