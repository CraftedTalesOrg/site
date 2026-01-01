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
    fontWeight: 'medium',
    transition: '{durations.fast}',
    outline: 'none',
    _placeholder: {
      color: 'text.muted',
    },
    _hover: {
      borderColor: 'brand.blue.500',
    },
    _focus: {
      borderColor: 'brand.blue.500',
      outline: 'none',
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
        h: 8,
        fontSize: 'xs',
      },
      md: {
        px: 4,
        h: 10,
        fontSize: 'md',
      },
      lg: {
        px: 5,
        h: 12,
        fontSize: 'lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Input = chakra(ChakraInput, inputRecipe);
