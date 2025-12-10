import { Box, Container, Flex, Text, Grid } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import FloatingCards from './FloatingCards';
import { Button } from '@/theming/components';

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
              fontFamily={'heading'}
              fontSize={{ base: '3rem', md: '4rem' }}
              fontWeight={'700'}
              lineHeight={'1.1'}
              mb={6}
              color={'text.primary'}
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
              fontSize={'1.2rem'}
              color={'text.secondary'}
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
                <Text
                  fontFamily={'heading'}
                  fontSize={'2.5rem'}
                  fontWeight={'700'}
                  color={'brand.blue.500'}
                >
                  {t($ => $.LANDING.HERO.STATS.MODS_COUNT)}
                </Text>
                <Text
                  fontSize={'0.85rem'}
                  color={'text.muted'}
                  textTransform={'uppercase'}
                  letterSpacing={'1px'}
                >
                  {t($ => $.LANDING.HERO.STATS.MODS)}
                </Text>
              </Box>
              <Box textAlign={'center'}>
                <Text
                  fontFamily={'heading'}
                  fontSize={'2.5rem'}
                  fontWeight={'700'}
                  color={'brand.blue.500'}
                >
                  {t($ => $.LANDING.HERO.STATS.DOWNLOADS_COUNT)}
                </Text>
                <Text
                  fontSize={'0.85rem'}
                  color={'text.muted'}
                  textTransform={'uppercase'}
                  letterSpacing={'1px'}
                >
                  {t($ => $.LANDING.HERO.STATS.DOWNLOADS)}
                </Text>
              </Box>
              <Box textAlign={'center'}>
                <Text
                  fontFamily={'heading'}
                  fontSize={'2.5rem'}
                  fontWeight={'700'}
                  color={'brand.blue.500'}
                >
                  {t($ => $.LANDING.HERO.STATS.CREATORS_COUNT)}
                </Text>
                <Text
                  fontSize={'0.85rem'}
                  color={'text.muted'}
                  textTransform={'uppercase'}
                  letterSpacing={'1px'}
                >
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
