'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const headingRecipe = defineRecipe({
  base: {
    fontFamily: 'heading',
    fontWeight: '700',
    color: 'text.primary',
  },
  variants: {
    variant: {
      section: {
        fontSize: { base: '3xl', md: '4xl' },
        mb: 4,
      },
      gradient: {
        fontSize: { base: '3xl', md: '5xl' },
        lineHeight: 1.1,
        mb: 6,
        bgGradient: 'to-b',
        gradientFrom: 'brand.gold.300',
        gradientTo: 'brand.gold.500',
        bgClip: 'text',
      },
    },
  },
  defaultVariants: {
    variant: 'section',
  },
});

export const Heading = chakra('h2', headingRecipe);
