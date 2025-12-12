import { Box, Container, Flex, Grid } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import FloatingCards from './FloatingCards';
import { Button, Text } from '@/theming/components';
import { toaster } from '../Toaster';

export default function HeroSection(): JSX.Element {
  const { t } = useTranslation();

  const handleClick = (): void => {
    toaster.error({
      title: `Nuh-uh`,
      description: `There is no game yet, what do you expect to find here?`,
    });
  };

  const handleDiscordClick = (): void => {
    window.open('https://discord.gg/Rkm2tF4GWM', '_blank', 'noopener,noreferrer');
  };

  return (
    <Box
      as={'section'}
      position={'relative'}
      zIndex={1}
      minHeight={'100vh'}
      display={'flex'}
      alignItems={'center'}
      py={{ base: 32, md: 16 }}
      px={{ base: 4, sm: 6, md: 8 }}
      overflow={'hidden'}
    >
      <Container maxWidth={'1400px'}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={16}
          alignItems={'center'}
        >
          <Box
            textAlign={{ base: 'center', lg: 'left' }}
            display={'flex'}
            flexDirection={'column'}
            alignItems={{ base: 'center', lg: 'flex-start' }}
            width={'100%'}
            maxWidth={'100%'}
          >
            <Text
              as={'h1'}
              variant={'heroTitle'}
              mb={6}
              width={'100%'}
              maxWidth={'100%'}
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
              maxWidth={{ base: '100%', md: '500px' }}
              width={'100%'}
            >
              {t($ => $.LANDING.HERO.DESCRIPTION)}
            </Text>
            <Text
              variant={'caption'}
              mb={8}
              maxWidth={{ base: '100%', md: '500px' }}
              width={'100%'}
            >
              {t($ => $.LANDING.HERO.DESCRIPTION_HIGHLIGHT)}
            </Text>
            <Flex gap={4} mb={12} flexWrap={'wrap'} justifyContent={{ base: 'center', lg: 'flex-start' }}>
              <Button variant={'gradient'} onClick={handleClick}>
                {t($ => $.LANDING.HERO.CTA_EXPLORE)}
              </Button>
              <Button variant={'outline'} onClick={handleDiscordClick}>
                {t($ => $.LANDING.HERO.CTA_DISCORD)}
              </Button>
            </Flex>
            {/* <Flex
              gap={{ base: 6, sm: 8, md: 12 }}
              justifyContent={{ base: 'center', lg: 'flex-start' }}
              flexWrap={'wrap'}
              width={'100%'}
            >
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
            </Flex> */}
          </Box>
          <Box position={'relative'} display={{ base: 'none', lg: 'block' }}>
            <FloatingCards />
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
