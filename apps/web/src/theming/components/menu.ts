'use client';
import { menuAnatomy } from '@chakra-ui/react/anatomy';
import { defineSlotRecipe } from '@chakra-ui/react';

export const menuRecipe = defineSlotRecipe({
  slots: menuAnatomy.keys(),
  base: {
    content: {
      bg: 'bg.card',
      border: '1px solid',
      borderColor: 'border.default',
      borderRadius: 'lg',
      boxShadow: 'card.elevated',
      py: 2,
      minW: '200px',
    },
    item: {
      px: 4,
      py: 2,
      fontSize: 'sm',
      color: 'text.secondary',
      cursor: 'pointer',
      transition: '{durations.fast}',
      _hover: {
        bg: 'alpha.blue.10',
        color: 'brand.blue.500',
      },
      _first: {
        _hover: {
          borderTopRadius: 'md',
        },
      },
      _last: {
        _hover: {
          borderBottomRadius: 'md',
        },
      },
    },
    itemGroupLabel: {
      px: 4,
      py: 2,
      fontSize: 'xs',
      color: 'text.muted',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    separator: {
      my: 2,
      borderColor: 'border.default',
    },
  },
});
