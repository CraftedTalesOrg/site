import { Search } from 'lucide-react';
import { Button, Input, XStack } from 'tamagui';
import type { JSX } from 'react';

interface SearchBoxProps {
  placeholder?: string;
}

export function SearchBox({ placeholder = 'Buscar mods, plugins, texturas...' }: SearchBoxProps): JSX.Element {
  return (
    <XStack
      bg={'$backgroundStrong'}
      borderWidth={1}
      borderColor={'$borderColor'}
      borderRadius={'$4'}
      ai={'center'}
      px={'$4'}
      focusStyle={{
        borderColor: '$accent',
      }}>
      <Input
        flex={1}
        placeholder={placeholder}
        placeholderTextColor={'$mutedForeground'}
        bg={'transparent'}
        borderWidth={0}
        size={'$5'}
        color={'$color'}
      />
      <Button
        size={'$3'}
        circular
        bg={'transparent'}
        icon={<Search size={20} color={'var(--accent)'} />}
        hoverStyle={{ bg: '$backgroundHover' }}
      />
    </XStack>
  );
}
