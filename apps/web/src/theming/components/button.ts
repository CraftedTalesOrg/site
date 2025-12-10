'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      'gradient': {
        px: 10,
        py: 6,
        fontSize: 'md',
        bgGradient: 'to-b',
        gradientFrom: 'brand.gold.300',
        gradientTo: 'brand.gold.500',
        color: 'text.primary',
        boxShadow: 'glow.blue',
        fontWeight: '600',
        borderRadius: 'sm',
        transition: '{durations.fast}',
        cursor: 'pointer',
        border: 'none',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'glow.hover.blue',
        },
      },
      'outline-hover': {
        px: 10,
        py: 6,
        fontSize: 'md',
        bg: 'transparent',
        color: 'text.primary',
        border: '1px solid',
        borderColor: 'border.default',
        fontWeight: '600',
        borderRadius: 'sm',
        transition: '{durations.fast}',
        cursor: 'pointer',
        _hover: {
          borderColor: 'brand.blue.500',
          color: 'brand.blue.500',
        },
      },
    },
  },
});

export const Button = chakra('button', buttonRecipe);
