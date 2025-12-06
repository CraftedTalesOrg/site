import { styled, Text } from 'tamagui';

export const GradientText = styled(Text, {
  name: 'GradientText',

  variants: {
    variant: {
      primary: {
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundImage: 'linear-gradient(135deg, $accent, $primary)',
      },
      accent: {
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundImage: 'linear-gradient(135deg, $accentHover, $accent)',
      },
    },
  } as const,

  defaultVariants: {
    variant: 'primary',
  },
});
