import { Box, Container, Text, Grid } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Sword, Zap, Shield, Globe, Sparkles, Package } from 'lucide-react';
import SearchBar from './SearchBar';
import ModCard from './ModCard';

type ModKey = 'MOD_1' | 'MOD_2' | 'MOD_3' | 'MOD_4' | 'MOD_5' | 'MOD_6';

const mods: { icon: JSX.Element; badge?: string; key: ModKey }[] = [
  { icon: <Sword size={64} />, badge: 'NEW', key: 'MOD_1' },
  { icon: <Zap size={64} />, badge: 'HOT', key: 'MOD_2' },
  { icon: <Shield size={64} />, key: 'MOD_3' },
  { icon: <Globe size={64} />, key: 'MOD_4' },
  { icon: <Sparkles size={64} />, badge: 'NEW', key: 'MOD_5' },
  { icon: <Package size={64} />, key: 'MOD_6' },
];

export default function FeaturedModsSection(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Box as={'section'} position={'relative'} zIndex={1} py={24} px={8}>
      <Container maxWidth={'1200px'}>
        <Box textAlign={'center'} maxWidth={'700px'} mx={'auto'} mb={16}>
          <Box
            display={'inline-block'}
            px={4}
            py={2}
            bg={'rgba(0, 212, 255, 0.15)'}
            color={'brand.cyan.500'}
            borderRadius={'20px'}
            fontSize={'0.8rem'}
            fontWeight={'600'}
            textTransform={'uppercase'}
            letterSpacing={'1px'}
            mb={4}
          >
            {t($ => $.LANDING.FEATURED.TAG)}
          </Box>
          <Text
            fontFamily={'heading'}
            fontSize={'2.75rem'}
            fontWeight={'700'}
            mb={4}
          >
            {t($ => $.LANDING.FEATURED.TITLE)}
          </Text>
          <Text color={'text.secondary'} fontSize={'1.1rem'}>
            {t($ => $.LANDING.FEATURED.SUBTITLE)}
          </Text>
        </Box>
        <SearchBar placeholder={t($ => $.LANDING.FEATURED.SEARCH_PLACEHOLDER)} />
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={8}
        >
          {mods.map(mod => (
            <ModCard
              key={mod.key}
              icon={mod.icon}
              badge={mod.badge}
              category={t($ => $.LANDING.FEATURED.MODS[mod.key].CATEGORY)}
              title={t($ => $.LANDING.FEATURED.MODS[mod.key].TITLE)}
              description={t($ => $.LANDING.FEATURED.MODS[mod.key].DESCRIPTION)}
              downloads={t($ => $.LANDING.FEATURED.MODS[mod.key].DOWNLOADS)}
              rating={t($ => $.LANDING.FEATURED.MODS[mod.key].RATING)}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
