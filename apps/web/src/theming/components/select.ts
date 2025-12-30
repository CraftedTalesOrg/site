'use client';

import { Select as ChakraSelect, defineSlotRecipe } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/react/anatomy';

export const selectSlotRecipe = defineSlotRecipe({
  className: 'select',
  slots: selectAnatomy.keys(),
  base: {
    trigger: {
      bg: 'bg.card',
      border: '1px solid',
      borderColor: 'border.default',
      borderRadius: 'sm',
      color: 'text.primary',
      fontSize: 'md',
      fontWeight: '500',
      transition: '{durations.fast}',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      _hover: {
        borderColor: 'text.secondary',
      },
      _focus: {
        borderColor: 'brand.blue.500',
        boxShadow: '0 0 0 1px {colors.brand.blue.500}',
        outline: 'none',
      },
    },
    content: {
      bg: 'bg.card',
      border: '1px solid',
      borderColor: 'border.default',
      borderRadius: 'sm',
      boxShadow: 'card.elevated',
      py: 2,
      maxH: '300px',
      overflowY: 'auto',
      zIndex: 1000,
    },
    item: {
      color: 'text.primary',
      fontSize: 'sm',
      fontWeight: '500',
      px: 3,
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
      },
    },
  },
  variants: {
    size: {
      sm: {
        trigger: {
          h: 8,
          fontSize: 'sm',
          px: 3,
        },
      },
      md: {
        trigger: {
          h: 10,
          fontSize: 'md',
          px: 4,
        },
      },
      lg: {
        trigger: {
          h: 12,
          fontSize: 'lg',
          px: 4,
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Select = ChakraSelect;
