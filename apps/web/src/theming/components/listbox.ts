'use client';

import { defineSlotRecipe } from '@chakra-ui/react';
import { listboxAnatomy } from '@chakra-ui/react/anatomy';

export const listboxSlotRecipe = defineSlotRecipe({
  className: 'listbox',
  slots: listboxAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    },
    label: {
      color: 'text.primary',
      fontSize: 'sm',
      fontWeight: 'semibold',
      mb: 3,
    },
    content: {
      bg: 'bg.card',
      border: '1px solid',
      borderColor: 'border.default',
      borderRadius: 'sm',
      py: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    item: {
      color: 'text.primary',
      fontWeight: 'medium',
      fontSize: 'sm',
      px: 3,
      py: 2,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      borderRadius: 'sm',
      transition: '{durations.fast}',
      _hover: {
        background: '',
        backgroundColor: 'brand.blue.600',
        color: 'text.primary',
      },
      _highlighted: {
        background: '',
        backgroundColor: 'brand.blue.600',
        color: 'text.primary',
      },
      _selected: {
        background: '',
        backgroundColor: 'brand.blue.500',
        color: 'text.primary',
        fontWeight: 'semibold',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    itemText: {
      flex: 1,
    },
    itemIndicator: {
      color: 'text.primary',
      flexShrink: 0,
    },
  },
  variants: {
    variant: {
      subtle: {
        content: {
          bg: 'bg.card',
          borderColor: 'border.default',
        },
      },
      solid: {
        content: {
          bg: 'bg.secondary',
          borderColor: 'transparent',
        },
      },
      plain: {
        content: {
          bg: 'transparent',
          border: 'none',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'subtle',
  },
});
