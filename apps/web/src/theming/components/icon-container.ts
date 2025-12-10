'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

export const iconContainerRecipe = defineRecipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.4s ease',
  },
  variants: {
    size: {
      md: {
        width: '60px',
        height: '60px',
        fontSize: '1.75rem',
        borderRadius: '14px',
      },
      lg: {
        width: '70px',
        height: '70px',
        fontSize: '2rem',
        borderRadius: 'lg',
      },
    },
    colorPalette: {
      cyan: {
        bgGradient: 'to-br',
        gradientFrom: 'alpha.cyan.15',
        gradientTo: 'alpha.purple.15',
        color: 'brand.cyan.500',
        _groupHover: {
          transform: 'scale(1.1) rotate(5deg)',
          gradientFrom: 'alpha.cyan.25',
          gradientTo: 'alpha.purple.25',
        },
      },
      purple: {
        bgGradient: 'to-br',
        gradientFrom: 'alpha.purple.15',
        gradientTo: 'alpha.cyan.15',
        color: 'brand.purple.500',
        _groupHover: {
          transform: 'scale(1.1) rotate(5deg)',
          gradientFrom: 'alpha.purple.25',
          gradientTo: 'alpha.cyan.25',
        },
      },
      green: {
        bgGradient: 'to-br',
        gradientFrom: 'alpha.green.15',
        gradientTo: 'alpha.cyan.15',
        color: 'brand.green.500',
        _groupHover: {
          transform: 'scale(1.1)',
          gradientFrom: 'alpha.green.25',
          gradientTo: 'alpha.cyan.25',
        },
      },
    },
  },
  defaultVariants: {
    size: 'lg',
    colorPalette: 'cyan',
  },
});

export const IconContainer = chakra('div', iconContainerRecipe);
