import { Checkbox, Pagination, Select } from '@/components/common';
import {
  ButtonGroup,
  IconButton,
  Input,
  Text,
} from '@/theming/components';
import {
  Box,
  CheckboxGroup,
  Container,
  createListCollection,
  Fieldset,
  Flex,
  Grid,
  ListCollection,
} from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { Grid as GridIcon, List } from 'lucide-react';
import { JSX, useState } from 'react';
import { SelectItem } from 'src/components/common/Select';

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
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Mock data for filters (will be replaced with real data)
  const categories = ['Combat', 'Building', 'Magic', 'Utility'];
  const gameVersions = ['1.0.0', '1.1.0', '1.2.0'];

  const sortByOptions: ListCollection<SelectItem> = createListCollection({
    items: [
      { label: 'Created', value: 'createdAt' },
      { label: 'Updated', value: 'updatedAt' },
      { label: 'Downloads', value: 'downloads' },
      { label: 'Likes', value: 'likes' },
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
    <Container maxW={'container.xl'} px={{ base: 4, lg: '12.5%' }} py={20}>
      <Grid templateColumns={{ base: '1fr', lg: '1fr 3fr' }} gap={6} py={8}>
        {/* Left Column - Filters */}
        <Box>
          <Text fontSize={'lg'} fontWeight={'bold'} mb={4}>
            {'Filters'}
          </Text>

          {/* Category Filter */}
          <Box mb={6}>
            <Fieldset.Root>
              <CheckboxGroup
                value={selectedCategories}
                onValueChange={setSelectedCategories}
              >
                <Fieldset.Legend fontWeight={'medium'} mb={3}>
                  {'Categories'}
                </Fieldset.Legend>
                <Flex direction={'column'} gap={2}>
                  {categories.map(category => (
                    <Checkbox
                      key={category}
                      value={category}
                    >
                      {category}
                    </Checkbox>
                  ))}
                </Flex>
              </CheckboxGroup>
            </Fieldset.Root>
          </Box>

          {/* Game Version Filter */}
          <Box>
            <Fieldset.Root>
              <Fieldset.Legend fontWeight={'medium'} mb={3}>
                {'Game Versions'}
              </Fieldset.Legend>
              <CheckboxGroup
                value={selectedGameVersions}
                onValueChange={setSelectedGameVersions}
              >
                <Flex direction={'column'} gap={2}>
                  {gameVersions.map(version => (
                    <Checkbox
                      key={version}
                      value={version}
                    >
                      {version}
                    </Checkbox>
                  ))}
                </Flex>
              </CheckboxGroup>
            </Fieldset.Root>
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
              onValueChange={details => setSortBy(details.value[0])}
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
                count={100}
                pageSize={pageSize}
                page={currentPage}
                onPageChange={e => setCurrentPage(e.page)}
              />
            </Flex>
          </Flex>

          {/* Mods List/Grid */}
          <Box mb={6} minH={'400px'}>
            <Text>{'[Mods List/Grid View]'}</Text>
          </Box>

          {/* Bottom Pagination */}
          <Flex justifyContent={'flex-end'}>
            <Pagination
              count={100}
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
