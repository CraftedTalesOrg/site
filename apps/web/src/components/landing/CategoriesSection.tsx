import { Box, Container, Grid } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Sword, Wand2, Globe, Sparkles, Package, Image, Palette, FileCode } from 'lucide-react';
import CategoryCard from './CategoryCard';
import { Badge, Text } from '@/theming/components';

type CategoryKey = 'COMBAT' | 'MAGIC' | 'WORLD' | 'ADVENTURE' | 'ITEMS' | 'GRAPHICS' | 'TEXTURES' | 'UTILITY';

const categories: { icon: JSX.Element; key: CategoryKey }[] = [
  { icon: <Sword size={32} />, key: 'COMBAT' },
  { icon: <Wand2 size={32} />, key: 'MAGIC' },
  { icon: <Globe size={32} />, key: 'WORLD' },
  { icon: <Sparkles size={32} />, key: 'ADVENTURE' },
  { icon: <Package size={32} />, key: 'ITEMS' },
  { icon: <Image size={32} />, key: 'GRAPHICS' },
  { icon: <Palette size={32} />, key: 'TEXTURES' },
  { icon: <FileCode size={32} />, key: 'UTILITY' },
];

export default function CategoriesSection(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Box
      as={'section'}
      position={'relative'}
      zIndex={1}
      py={24}
      px={8}
      bg={'bg.secondary'}
    >
      <Container maxWidth={'1200px'}>
        <Box textAlign={'center'} maxWidth={'700px'} mx={'auto'} mb={16}>
          <Badge variant={'tag'} colorPalette={'gold'} mb={4}>
            {t($ => $.LANDING.CATEGORIES.TAG)}
          </Badge>
          <Text variant={'sectionTitle'} mb={4}>
            {t($ => $.LANDING.CATEGORIES.TITLE)}
          </Text>
          <Text variant={'subtitle'}>
            {t($ => $.LANDING.CATEGORIES.SUBTITLE)}
          </Text>
        </Box>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={6}
        >
          {categories.map(category => (
            <CategoryCard
              key={category.key}
              icon={category.icon}
              name={t($ => $.LANDING.CATEGORIES.ITEMS[category.key].NAME)}
              count={t($ => $.LANDING.CATEGORIES.ITEMS[category.key].COUNT)}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
