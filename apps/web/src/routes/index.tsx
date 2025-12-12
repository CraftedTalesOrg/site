import { Box } from '@chakra-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';
import {
  BackgroundEffects,
  CategoriesSection,
  FeaturesSection,
  HeroSection,
  TimelineSection,
} from '@/components/landing';

export const Route = createFileRoute('/')({ component: Landing });

function Landing(): JSX.Element {
  return (
    <>
      <BackgroundEffects />
      <Box position={'relative'}>
        <HeroSection />
        <CategoriesSection />
        {/* <FeaturedModsSection /> */}
        <TimelineSection />
        <FeaturesSection />
        {/* <CTASection /> */}
      </Box>
    </>
  );
}
