'use client';

import { Input as ChakraInput, chakra, defineRecipe } from '@chakra-ui/react';

const inputRecipe = defineRecipe({
  base: {
    width: '100%',
    bg: 'bg.card',
    border: '1px solid',
    borderColor: 'border.default',
    borderRadius: 'sm',
    color: 'text.primary',
    fontSize: 'md',
    fontWeight: '500',
    transition: '{durations.fast}',
    outline: 'none',
    _placeholder: {
      color: 'text.muted',
    },
    _hover: {
      borderColor: 'text.secondary',
    },
    _focus: {
      borderColor: 'brand.blue.500',
      boxShadow: '0 0 0 1px {colors.brand.blue.500}',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    size: {
      sm: {
        px: 3,
        py: 2,
        h: 10,
        fontSize: 'sm',
      },
      md: {
        px: 4,
        py: 2,
        h: 12,
        fontSize: 'md',
      },
      lg: {
        px: 4,
        py: 3,
        h: 14,
        fontSize: 'lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Input = chakra(ChakraInput, inputRecipe);
