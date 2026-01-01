'use client';

import { Checkbox as ChakraCheckbox, defineSlotRecipe } from '@chakra-ui/react';
import { checkboxAnatomy } from '@chakra-ui/react/anatomy';

export const checkboxSlotRecipe = defineSlotRecipe({
  className: 'checkbox',
  slots: checkboxAnatomy.keys(),
  base: {
    control: {
      width: '20px',
      height: '20px',
      color: 'border.base',
      border: '1px solid',
      borderRadius: 'sm',
      bg: 'bg.card',
      transition: '{durations.fast}',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      _hover: {
        borderColor: 'brand.blue.500',
      },
      _checked: {
        bg: 'brand.blue.500',
        borderColor: 'brand.blue.500',
        boxShadow: 'glow.blue',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    label: {
      color: 'text.primary',
      fontSize: 'sm',
      fontWeight: 'medium',
      cursor: 'pointer',
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
});

export const Checkbox = ChakraCheckbox;
