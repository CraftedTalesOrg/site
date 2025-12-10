import { Group, Text } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Card, IconContainer } from '@/theming/components';

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
    <Group asChild>
      <Card variant={'category'} colorPalette={colorPalette}>
        <IconContainer size={'lg'} colorPalette={colorPalette} mx={'auto'} mb={6}>
          {icon}
        </IconContainer>
        <Text fontFamily={'heading'} fontSize={'1.25rem'} fontWeight={'600'} mb={2} color={'text.primary'}>
          {name}
        </Text>
        <Text fontSize={'0.85rem'} color={'text.muted'}>
          {count}
        </Text>
      </Card>
    </Group>
  );
}
