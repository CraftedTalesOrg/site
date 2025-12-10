'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const cardRecipe = defineRecipe({
  base: {
    bg: 'bg.card',
    border: '1px solid',
    borderColor: 'border.default',
    borderRadius: 'lg',
    overflow: 'hidden',
    transition: '{durations.medium}',
  },
  variants: {
    variant: {
      pressable: {
        p: 8,
        cursor: 'pointer',
        _hover: {
          transform: 'translateY(-5px)',
        },
      },
      hoverable: {
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
      blue: {
        _hover: {
          borderColor: 'brand.blue.500',
          boxShadow: 'glow.blue',
        },
      },
      gold: {
        _hover: {
          borderColor: 'brand.gold.500',
          boxShadow: 'glow.gold',
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
    variant: 'pressable',
    colorPalette: 'blue',
  },
});

export const Card = chakra('div', cardRecipe);
