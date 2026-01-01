'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    color: 'text.primary',
    fontWeight: 'semibold',
    borderRadius: 'sm',
    border: 'none',
    cursor: 'pointer',
    transition: '{durations.fast}',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      gradient: {
        bgGradient: 'to-b',
        gradientFrom: 'brand.blue.500',
        gradientTo: 'brand.blue.600',
        _hover: {
          gradientFrom: 'brand.blue.600',
          gradientTo: 'brand.blue.700',
        },
      },
      solid: {
        bg: 'brand.blue.500',
        _hover: {
          color: 'text.primary',
          bg: 'brand.blue.600',
        },
      },
      outline: {
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'border.default',
        _hover: {
          bg: 'transparent',
          color: 'brand.blue.500',
          borderColor: 'brand.blue.500',
        },
      },
      transparent: {
        bg: 'transparent',
        color: 'text.secondary',
        _hover: {
          bg: 'transparent',
          color: 'brand.blue.500',
        },
      },
    },
    size: {
      sm: {
        h: 10,
        px: 6,
        py: 2,
        fontSize: 'sm',
      },
      md: {
        h: 14,
        px: 8,
        py: 4,
        fontSize: 'md',
      },
      lg: {
        h: 20,
        px: 10,
        py: 5,
        fontSize: 'lg',
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

export const Button = chakra('button', buttonRecipe);
