import { Box, Container, Grid } from '@chakra-ui/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Shield, RefreshCw, Users, Download, Star } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { Badge, Text } from '@/theming/components';

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
          <Badge variant={'tag'} colorPalette={'green'} mb={4}>
            {t($ => $.LANDING.FEATURES.TAG)}
          </Badge>
          <Text variant={'sectionTitle'} mb={4}>
            {t($ => $.LANDING.FEATURES.TITLE)}
          </Text>
          <Text variant={'subtitle'}>
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
