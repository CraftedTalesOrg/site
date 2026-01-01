'use client';

import { Select as ChakraSelect, defineSlotRecipe } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/react/anatomy';

export const selectSlotRecipe = defineSlotRecipe({
  className: 'select',
  slots: selectAnatomy.keys(),
  base: {
    trigger: {
      bg: 'blue',
      bgColor: 'bg.card',
      borderColor: 'red',
      // No idea why we can only change color to something and then we override with border
      border: '1px solid #2a2a3a', // border.default
      borderRadius: 'sm',
      color: 'text.primary',
      fontWeight: 'medium',
      transition: '{durations.fast}',
      _hover: {
        borderColor: 'brand.blue.500',
      },
      _focus: {
        borderColor: 'transparent',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    content: {
      bg: 'bg.card',
      border: '1px solid',
      borderColor: 'transparent',
      borderRadius: 'sm',
      py: 2,
      maxH: '300px',
      overflowY: 'auto',
      zIndex: 1000,
    },
    item: {
      color: 'text.primary',
      fontWeight: 'medium',
      px: 4,
      py: 2,
      cursor: 'pointer',
      transition: '{durations.fast}',
      _hover: {
        bg: 'bg.tertiary',
        color: 'brand.blue.500',
      },
      _selected: {
        bg: 'alpha.blue.15',
        color: 'brand.blue.500',
        fontWeight: 'semibold',
      },
    },
  },
  variants: {
    size: {
      sm: {
        trigger: {
          h: '10',
          fontSize: 'sm',
          px: 6,
        },
        item: {
          fontSize: 'sm',
          px: 3,
        },
      },
      md: {
        trigger: {
          h: '14',
          fontSize: 'md',
          px: 8,
        },
        item: {
          fontSize: 'md',
          px: 4,
        },
      },
      lg: {
        trigger: {
          h: '20',
          fontSize: 'lg',
          px: 10,
        },
        item: {
          fontSize: 'lg',
          px: 5,
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Select = ChakraSelect;
