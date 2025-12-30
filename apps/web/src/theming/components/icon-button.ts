'use client';

import { IconButton as ChakraIconButton, chakra, defineRecipe } from '@chakra-ui/react';

const iconButtonRecipe = defineRecipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'sm',
    transition: '{durations.fast}',
    cursor: 'pointer',
    flexShrink: 0,
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      outline: {
        bg: 'transparent',
        color: 'text.primary',
        border: '1px solid',
        borderColor: 'border.default',
        fontWeight: '600',
        _hover: {
          borderColor: 'brand.blue.500',
          color: 'brand.blue.500',
        },
      },
      solid: {
        bg: 'brand.blue.500',
        color: 'text.primary',
        border: 'none',
        boxShadow: 'glow.blue',
        fontWeight: '600',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'glow.hover.blue',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'text.secondary',
        border: 'none',
        fontWeight: '500',
        _hover: {
          bg: 'bg.tertiary',
          color: 'brand.blue.500',
        },
      },
    },
    size: {
      sm: {
        w: 8,
        h: 8,
        fontSize: 'sm',
        p: 0,
      },
      md: {
        w: 10,
        h: 10,
        fontSize: 'md',
        p: 0,
      },
      lg: {
        w: 12,
        h: 12,
        fontSize: 'lg',
        p: 0,
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
});

export const IconButton = chakra(ChakraIconButton, iconButtonRecipe);
