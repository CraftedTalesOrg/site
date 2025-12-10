import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';
import { Box } from '@chakra-ui/react';
import BackgroundEffects from '../components/BackgroundEffects';
import HeroSection from '../components/landing/HeroSection';
import CategoriesSection from '../components/landing/CategoriesSection';
import FeaturedModsSection from '../components/landing/FeaturedModsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import CTASection from '../components/landing/CTASection';

export const Route = createFileRoute('/')({ component: Landing });

function Landing(): JSX.Element {
  return (
    <>
      <BackgroundEffects />
      <Box position={'relative'}>
        <HeroSection />
        <CategoriesSection />
        <FeaturedModsSection />
        <FeaturesSection />
        <CTASection />
      </Box>
    </>
  );
}
