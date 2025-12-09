import { Box, Container, Text, Grid } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Shield, RefreshCw, Users, Download, Star } from 'lucide-react';
import FeatureCard from './FeatureCard';

type FeatureKey = 'FEATURE_1' | 'FEATURE_2' | 'FEATURE_3' | 'FEATURE_4' | 'FEATURE_5' | 'FEATURE_6';

const features: { icon: JSX.Element; key: FeatureKey }[] = [
  { icon: <Zap size={28} />, key: 'FEATURE_1' },
  { icon: <Shield size={28} />, key: 'FEATURE_2' },
  { icon: <RefreshCw size={28} />, key: 'FEATURE_3' },
  { icon: <Users size={28} />, key: 'FEATURE_4' },
  { icon: <Download size={28} />, key: 'FEATURE_5' },
  { icon: <Star size={28} />, key: 'FEATURE_6' },
];

export default function FeaturesSection(): JSX.Element {
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
          <Box
            display={'inline-block'}
            px={4}
            py={2}
            bg={'rgba(16, 185, 129, 0.15)'}
            color={'brand.green.500'}
            borderRadius={'20px'}
            fontSize={'0.8rem'}
            fontWeight={'600'}
            textTransform={'uppercase'}
            letterSpacing={'1px'}
            mb={4}
          >
            {t($ => $.LANDING.FEATURES.TAG)}
          </Box>
          <Text
            fontFamily={'heading'}
            fontSize={'2.75rem'}
            fontWeight={'700'}
            mb={4}
          >
            {t($ => $.LANDING.FEATURES.TITLE)}
          </Text>
          <Text color={'text.secondary'} fontSize={'1.1rem'}>
            {t($ => $.LANDING.FEATURES.SUBTITLE)}
          </Text>
        </Box>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={8}
        >
          {features.map(feature => (
            <FeatureCard
              key={feature.key}
              icon={feature.icon}
              title={t($ => $.LANDING.FEATURES.ITEMS[feature.key].TITLE)}
              description={t($ => $.LANDING.FEATURES.ITEMS[feature.key].DESCRIPTION)}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
