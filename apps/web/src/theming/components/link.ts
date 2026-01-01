'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';
import { Link as RouterLink } from '@tanstack/react-router';

const linkRecipe = defineRecipe({
  variants: {
    variant: {
      nav: {
        color: 'text.secondary',
        fontWeight: 'medium',
        fontSize: '0.95rem',
        position: 'relative',
        textDecoration: 'none',
        transition: '{durations.fast}',
        cursor: 'pointer',
        _hover: {
          color: 'brand.gold.500',
        },
        _active: {
          color: 'brand.gold.600',
        },
        _currentPage: {
          color: 'brand.gold.600',
        },
      },
      primary: {
        color: 'text.secondary',
        fontSize: '0.9rem',
        textDecoration: 'none',
        transition: '{durations.fast}',
        cursor: 'pointer',
        _hover: {
          color: 'brand.blue.600',
          textDecoration: 'underline',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export const Link = chakra(RouterLink, linkRecipe);
