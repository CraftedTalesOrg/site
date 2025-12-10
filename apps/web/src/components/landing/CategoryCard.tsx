import { Card, IconContainer, Text } from '@/theming/components';
import type { JSX } from 'react';

interface CategoryCardProps {
  icon: JSX.Element;
  name: string;
  count: string;
  colorPalette?: 'blue' | 'gold' | 'green';
}

export default function CategoryCard({
  icon,
  name,
  count,
  colorPalette = 'blue',
}: CategoryCardProps): JSX.Element {
  return (
    <Card variant={'pressable'} colorPalette={colorPalette}>
      <IconContainer size={'lg'} colorPalette={colorPalette} mx={'auto'} mb={6}>
        {icon}
      </IconContainer>
      <Text variant={'cardTitle'} mb={2} textAlign={'center'}>
        {name}
      </Text>
      <Text variant={'caption'} textAlign={'center'}>
        {count}
      </Text>
    </Card>
  );
}
