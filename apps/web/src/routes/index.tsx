import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';
import { Box } from '@chakra-ui/react';
import HeroSection from '../components/landing/HeroSection';
import CategoriesSection from '../components/landing/CategoriesSection';
import FeaturedModsSection from '../components/landing/FeaturedModsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import CTASection from '../components/landing/CTASection';

export const Route = createFileRoute('/')({ component: Landing });

function Landing(): JSX.Element {
  return (
    <Box position={'relative'}>
      {/* Background Pattern */}
      <div className={'bg-pattern'} />
      <div className={'grid-overlay'} />

      {/* Content */}
      <HeroSection />
      <CategoriesSection />
      <FeaturedModsSection />
      <FeaturesSection />
      <CTASection />
    </Box>
  );
}
