'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      gradient: {
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
      outline: {
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
      transparent: {
        bg: 'transparent',
        color: 'text.secondary',
        border: 'none',
        fontWeight: '500',
        borderRadius: 'sm',
        transition: '{durations.fast}',
        cursor: 'pointer',
        _hover: {
          color: 'brand.blue.500',
        },
      },
    },
    size: {
      sm: {
        px: 6,
        py: 2,
        fontSize: 'sm',
        h: '10',
      },
      md: {
        px: 8,
        py: 4,
        fontSize: 'md',
        h: '14',
      },
      lg: {
        px: 10,
        py: 5,
        fontSize: 'lg',
        h: '20',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Button = chakra('button', buttonRecipe);
