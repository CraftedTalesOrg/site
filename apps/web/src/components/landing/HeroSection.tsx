import { Box, Container, Flex, Grid } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import FloatingCards from './FloatingCards';
import { Button, Text } from '@/theming/components';

export default function HeroSection(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Box
      as={'section'}
      position={'relative'}
      zIndex={1}
      minHeight={'100vh'}
      display={'flex'}
      alignItems={'center'}
      py={{ base: 32, md: 16 }}
      px={8}
    >
      <Container maxWidth={'1400px'}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={16}
          alignItems={'center'}
        >
          <Box>
            <Text
              as={'h1'}
              variant={'heroTitle'}
              mb={6}
            >
              {t($ => $.LANDING.HERO.TITLE)}
              {' '}
              <Box
                as={'span'}
                bgGradient={'to-b'}
                gradientFrom={'brand.gold.300'}
                gradientTo={'brand.gold.500'}
                bgClip={'text'}
              >
                {t($ => $.LANDING.HERO.TITLE_HIGHLIGHT)}
              </Box>
            </Text>
            <Text
              variant={'heroSubtitle'}
              mb={8}
              maxWidth={'500px'}
            >
              {t($ => $.LANDING.HERO.DESCRIPTION)}
            </Text>
            <Flex gap={4} mb={12} flexWrap={'wrap'}>
              <Button variant={'gradient'}>
                {t($ => $.LANDING.HERO.CTA_EXPLORE)}
              </Button>
              <Button variant={'outline-hover'}>
                {t($ => $.LANDING.HERO.CTA_DISCORD)}
              </Button>
            </Flex>
            <Flex gap={12}>
              <Box textAlign={'center'}>
                <Text variant={'statValue'}>
                  {t($ => $.LANDING.HERO.STATS.MODS_COUNT)}
                </Text>
                <Text variant={'statLabel'}>
                  {t($ => $.LANDING.HERO.STATS.MODS)}
                </Text>
              </Box>
              <Box textAlign={'center'}>
                <Text variant={'statValue'}>
                  {t($ => $.LANDING.HERO.STATS.DOWNLOADS_COUNT)}
                </Text>
                <Text variant={'statLabel'}>
                  {t($ => $.LANDING.HERO.STATS.DOWNLOADS)}
                </Text>
              </Box>
              <Box textAlign={'center'}>
                <Text variant={'statValue'}>
                  {t($ => $.LANDING.HERO.STATS.CREATORS_COUNT)}
                </Text>
                <Text variant={'statLabel'}>
                  {t($ => $.LANDING.HERO.STATS.CREATORS)}
                </Text>
              </Box>
            </Flex>
          </Box>
          <Box position={'relative'} display={{ base: 'none', lg: 'block' }}>
            <FloatingCards />
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
