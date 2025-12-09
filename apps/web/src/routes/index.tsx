import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';
import { YStack } from 'tamagui';
import {
  CategoriesSection,
  CTASection,
  FeaturesSection,
  HeroSection,
} from '../components/landing';

export const Route = createFileRoute('/')({ component: App });

function App(): JSX.Element {
  return (
    <YStack flex={1} bg={'$background'} pt={80}>
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <CTASection />
    </YStack>
  );
}
