'use client';

import { Group, chakra, defineRecipe } from '@chakra-ui/react';

const buttonGroupRecipe = defineRecipe({
  base: {
    display: 'flex',
    gap: 0,
  },
  variants: {
    attached: {
      true: {
        '& > button:not(:first-of-type)': {
          borderLeftWidth: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
        '& > button:not(:last-of-type)': {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      },
      false: {
        gap: 2,
      },
    },
  },
  defaultVariants: {
    attached: false,
  },
});

export const ButtonGroup = chakra(Group, buttonGroupRecipe);
