'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

const badgeRecipe = defineRecipe({
  base: {
    display: 'inline-block',
    borderRadius: 'xl',
    fontWeight: 'semibold',
    textTransform: 'uppercase',
  },
  variants: {
    variant: {
      tag: {
        px: 3,
        py: 1,
        fontSize: 'xs',
      },
      status: {
        position: 'absolute',
        top: 4,
        right: 4,
        px: 3,
        py: '0.35rem',
        fontSize: 'xs',
        fontWeight: 'bold',
        color: 'white',
      },
    },
    colorPalette: {
      blue: {
        bg: 'alpha.blue.15',
        color: 'brand.blue.500',
      },
      gold: {
        bg: 'alpha.gold.15',
        color: 'brand.gold.500',
      },
      green: {
        bg: 'alpha.green.15',
        color: 'brand.green.500',
      },
      orange: {
        bg: 'brand.orange.500',
        color: 'white',
      },
    },
  },
  defaultVariants: {
    variant: 'tag',
    colorPalette: 'blue',
  },
});

export const Badge = chakra('span', badgeRecipe);
