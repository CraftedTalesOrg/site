'use client';

import { chakra, defineRecipe } from '@chakra-ui/react';

const iconContainerRecipe = defineRecipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: '{durations.medium}',
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
      blue: {
        bgGradient: 'to-br',
        gradientFrom: 'alpha.blue.15',
        gradientTo: 'alpha.gold.15',
        color: 'brand.blue.500',
        _groupHover: {
          transform: 'scale(1.1) rotate(5deg)',
          gradientFrom: 'alpha.blue.25',
          gradientTo: 'alpha.gold.25',
        },
      },
      gold: {
        bgGradient: 'to-br',
        gradientFrom: 'alpha.gold.15',
        gradientTo: 'alpha.blue.15',
        color: 'brand.gold.500',
        _groupHover: {
          transform: 'scale(1.1) rotate(5deg)',
          gradientFrom: 'alpha.gold.25',
          gradientTo: 'alpha.blue.25',
        },
      },
      green: {
        bgGradient: 'to-br',
        gradientFrom: 'alpha.green.15',
        gradientTo: 'alpha.blue.15',
        color: 'brand.green.500',
        _groupHover: {
          transform: 'scale(1.1)',
          gradientFrom: 'alpha.green.25',
          gradientTo: 'alpha.blue.25',
        },
      },
    },
  },
  defaultVariants: {
    size: 'lg',
    colorPalette: 'blue',
  },
});

export const IconContainer = chakra('div', iconContainerRecipe);
