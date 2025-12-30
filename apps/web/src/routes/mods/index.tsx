import {
  ButtonGroup,
  IconButton,
  Checkbox,
  Input,
  Select,
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
  Pagination,
  Portal,
} from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Grid as GridIcon, List } from 'lucide-react';
import { JSX, useState } from 'react';

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

  // Mock data for filters (will be replaced with real data)
  const categories = ['Combat', 'Building', 'Magic', 'Utility'];
  const gameVersions = ['1.0.0', '1.1.0', '1.2.0'];

  const sortByOptions = createListCollection({
    items: [
      { label: 'Created', value: 'createdAt' },
      { label: 'Updated', value: 'updatedAt' },
      { label: 'Downloads', value: 'downloads' },
      { label: 'Likes', value: 'likes' },
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
                    <Checkbox.Root key={category} value={category}>
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{category}</Checkbox.Label>
                    </Checkbox.Root>
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
                    <Checkbox.Root key={version} value={version}>
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{version}</Checkbox.Label>
                    </Checkbox.Root>
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
                aria-label={'Grid view'}
                variant={viewMode === 'grid' ? 'solid' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <GridIcon size={16} />
              </IconButton>
              <IconButton
                aria-label={'List view'}
                variant={viewMode === 'list' ? 'solid' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </IconButton>
            </ButtonGroup>

            {/* Sort Controls & Pagination */}
            <Flex
              gap={2}
              alignItems={'center'}
              flex={'1'}
              justifyContent={'flex-end'}
              flexWrap={'wrap'}
            >
              {/* Sort By Select */}
              <Select.Root
                collection={sortByOptions}
                size={'sm'}
                width={'auto'}
                value={[sortBy]}
                onValueChange={details => setSortBy(details.value[0])}
              >
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder={'Sort by'} />
                    <Select.Indicator />
                  </Select.Trigger>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {sortByOptions.items.map(item => (
                        <Select.Item
                          key={item.value}
                          item={item}
                        >
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>

              <Pagination.Root
                count={100}
                pageSize={20}
                page={currentPage}
                onPageChange={e => setCurrentPage(e.page)}
              >
                <ButtonGroup size={'sm'} variant={'outline'}>
                  <Pagination.PrevTrigger asChild>
                    <IconButton aria-label={'Previous page'}>
                      <ChevronLeft size={16} />
                    </IconButton>
                  </Pagination.PrevTrigger>

                  <Pagination.Items
                    render={page => (
                      <IconButton
                        key={page.value}
                        aria-label={`Page ${page.value}`}
                        variant={{ base: 'outline', _selected: 'solid' }}
                      >
                        {page.value}
                      </IconButton>
                    )}
                  />

                  <Pagination.NextTrigger asChild>
                    <IconButton aria-label={'Next page'}>
                      <ChevronRight size={16} />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </Flex>
          </Flex>

          {/* Mods List/Grid */}
          <Box mb={6} minH={'400px'}>
            <Text>{'[Mods List/Grid View]'}</Text>
          </Box>

          {/* Bottom Pagination */}
          <Flex justifyContent={'center'}>
            <Pagination.Root
              count={100}
              pageSize={20}
              page={currentPage}
              onPageChange={e => setCurrentPage(e.page)}
            >
              <ButtonGroup size={'sm'} variant={'outline'}>
                <Pagination.PrevTrigger asChild>
                  <IconButton aria-label={'Previous page'}>
                    <ChevronLeft size={16} />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={page => (
                    <IconButton
                      key={page.value}
                      aria-label={`Page ${page.value}`}
                      variant={{ base: 'outline', _selected: 'solid' }}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton aria-label={'Next page'}>
                    <ChevronRight size={16} />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </Flex>
        </Box>
      </Grid>
    </Container>
  );
}
