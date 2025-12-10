'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      'gradient': {
        px: 10,
        py: 6,
        fontSize: 'md',
        bgGradient: 'to-r',
        gradientFrom: 'brand.cyan.500',
        gradientTo: 'brand.purple.500',
        color: 'text.primary',
        boxShadow: 'glow.cyan',
        fontWeight: '600',
        borderRadius: 'sm',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: 'none',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'glow.hover.cyan',
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
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        _hover: {
          borderColor: 'brand.cyan.500',
          color: 'brand.cyan.500',
        },
      },
    },
  },
});

export const Button = chakra('button', buttonRecipe);
