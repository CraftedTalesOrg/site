import { Checkbox as ChakraCheckbox, CheckboxRootProps } from '@chakra-ui/react';
import { JSX } from 'react';

export function Checkbox({ children, ...rest }: CheckboxRootProps): JSX.Element {
  return (
    <ChakraCheckbox.Root
      {...rest}
    >
      <ChakraCheckbox.HiddenInput />
      <ChakraCheckbox.Control />
      <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
    </ChakraCheckbox.Root>
  );
}
