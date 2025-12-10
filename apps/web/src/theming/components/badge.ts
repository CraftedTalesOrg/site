'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const badgeRecipe = defineRecipe({
  base: {
    display: 'inline-block',
    borderRadius: 'xl',
    fontWeight: '600',
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
        fontWeight: '700',
        color: 'white',
      },
    },
    colorPalette: {
      cyan: {
        bg: 'alpha.cyan.15',
        color: 'brand.cyan.500',
      },
      purple: {
        bg: 'alpha.purple.15',
        color: 'brand.purple.500',
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
    colorPalette: 'cyan',
  },
});

export const Badge = chakra('span', badgeRecipe);
