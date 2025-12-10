'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const cardRecipe = defineRecipe({
  base: {
    bg: 'bg.card',
    border: '1px solid',
    borderColor: 'border.default',
    borderRadius: 'lg',
    overflow: 'hidden',
    transition: 'all 0.4s ease',
  },
  variants: {
    variant: {
      category: {
        p: 8,
        textAlign: 'center',
        cursor: 'pointer',
        _hover: {
          transform: 'translateY(-8px)',
        },
      },
      mod: {
        overflow: 'hidden',
        _hover: {
          transform: 'translateY(-5px)',
        },
      },
      feature: {
        p: 8,
        _hover: {
          transform: 'translateY(-5px)',
        },
      },
      floating: {
        position: 'absolute',
        boxShadow: 'card.elevated',
      },
    },
    colorPalette: {
      cyan: {
        _hover: {
          borderColor: 'brand.cyan.500',
          boxShadow: 'glow.cyan',
        },
      },
      purple: {
        _hover: {
          borderColor: 'brand.purple.500',
          boxShadow: 'glow.purple',
        },
      },
      green: {
        _hover: {
          borderColor: 'brand.green.500',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'category',
    colorPalette: 'cyan',
  },
});

export const Card = chakra('div', cardRecipe);
