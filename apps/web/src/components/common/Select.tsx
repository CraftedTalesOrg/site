import { Select as ChakraSelect, SelectRootProps } from '@chakra-ui/react';
import { JSX } from 'react';

export interface SelectItem<T extends string = string> {
  label: string;
  value: T;
}

interface SelectProps<T extends SelectItem> extends SelectRootProps<T> {
  placeholder?: string;
}

export function Select<T extends SelectItem>({
  collection,
  placeholder,
  ...rest
}: SelectProps<T>): JSX.Element {
  return (
    <ChakraSelect.Root
      collection={collection}
      {...rest}
    >
      <ChakraSelect.Control>
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText placeholder={placeholder} />
          <ChakraSelect.Indicator />
        </ChakraSelect.Trigger>
      </ChakraSelect.Control>

      <ChakraSelect.Positioner>
        <ChakraSelect.Content>
          {collection.items.map(item => (
            <ChakraSelect.Item key={item.value} item={item}>
              {item.label}
            </ChakraSelect.Item>
          ))}
        </ChakraSelect.Content>
      </ChakraSelect.Positioner>
    </ChakraSelect.Root>
  );
}
