'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

const paginationButtonRecipe = defineRecipe({
  base: {
    bg: 'bg.card',
    border: '1px solid',
    borderColor: 'border.default',
    color: 'text.primary',
    borderRadius: 'sm',
    minW: 8,
    h: 8,
    fontSize: 'sm',
    fontWeight: '600',
    transition: '{durations.fast}',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    _hover: {
      borderColor: 'brand.blue.500',
      color: 'brand.blue.500',
    },
    _selected: {
      bg: 'brand.blue.500',
      borderColor: 'brand.blue.500',
      color: 'text.primary',
      boxShadow: 'glow.blue',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
});

export const PaginationButton = chakra('button', paginationButtonRecipe);
