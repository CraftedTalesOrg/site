import { Listbox as ChakraListbox, ListboxRootProps } from '@chakra-ui/react';
import { JSX } from 'react';

export interface ListboxItem<T extends string = string> {
  label: string;
  value: T;
}

interface ListboxProps<T extends ListboxItem> extends ListboxRootProps<T> {
  label?: string;
  maxH?: string;
}

export function Listbox<T extends ListboxItem>({
  collection,
  label,
  maxH,
  ...rest
}: ListboxProps<T>): JSX.Element {
  return (
    <ChakraListbox.Root
      collection={collection}
      {...rest}
    >
      {label && (
        <ChakraListbox.Label fontWeight={'medium'} mb={3}>
          {label}
        </ChakraListbox.Label>
      )}
      <ChakraListbox.Content maxH={maxH}>
        {collection.items.map(item => (
          <ChakraListbox.Item
            item={item}
            key={item.value}
          >
            <ChakraListbox.ItemText>{item.label}</ChakraListbox.ItemText>
            <ChakraListbox.ItemIndicator />
          </ChakraListbox.Item>
        ))}
      </ChakraListbox.Content>
    </ChakraListbox.Root>
  );
}
