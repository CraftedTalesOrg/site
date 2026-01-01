'use client';

import { IconButton as ChakraIconButton, chakra, defineRecipe } from '@chakra-ui/react';
import { buttonRecipe } from './button';

const iconButtonRecipe = defineRecipe({
  base: buttonRecipe.base,
  variants: {
    variant: {
      outline: buttonRecipe.variants?.variant.outline || {},
      solid: buttonRecipe.variants?.variant.solid || {},
      transparent: buttonRecipe.variants?.variant.transparent || {},
    },
    size: {
      sm: {
        w: 8,
        h: 8,
        fontSize: 'sm',
      },
      md: {
        w: 10,
        h: 10,
        fontSize: 'md',
      },
      lg: {
        w: 12,
        h: 12,
        fontSize: 'lg',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
});

export const IconButton = chakra(ChakraIconButton, iconButtonRecipe);
