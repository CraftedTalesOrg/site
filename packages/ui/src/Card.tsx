import { styled, YStack } from 'tamagui';

export const Card = styled(YStack, {
  name: 'Card',
  backgroundColor: '$backgroundStrong',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$4',
  overflow: 'hidden',
  cursor: 'pointer',

  hoverStyle: {
    borderColor: '$accent',
    transform: 'translateY(-5px)',
    shadowColor: '$accent',
    shadowRadius: 30,
    shadowOpacity: 0.3,
  },

  pressStyle: {
    transform: 'translateY(-2px)',
  },

  variants: {
    size: {
      sm: {
        padding: '$4',
      },
      md: {
        padding: '$5',
      },
      lg: {
        padding: '$6',
      },
    },
    interactive: {
      false: {
        cursor: 'default',
        hoverStyle: {},
        pressStyle: {},
      },
    },
  } as const,

  defaultVariants: {
    size: 'md',
  },
});
