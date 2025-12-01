import { createLink } from '@tanstack/react-router';
import { Button, styled } from 'tamagui';

const StyledLinkButton = styled(Button, {
  name: 'ButtonLink',
  textProps: { textDecorationLine: 'none' },

  variants: {
    unstyled: {
      true: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        height: 'auto',
      },
    },
  } as const,
});

export const ButtonLink = createLink(StyledLinkButton);
