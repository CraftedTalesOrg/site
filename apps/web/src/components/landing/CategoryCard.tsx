import { Card, IconContainer, Text } from '@/theming/components';
import type { JSX } from 'react';
import { toaster } from '../Toaster';

interface CategoryCardProps {
  icon: JSX.Element;
  name: string;
  count: string;
}

export default function CategoryCard({
  icon,
  name,
  count,
}: CategoryCardProps): JSX.Element {
  const handleClick = (): void => {
    toaster.error({
      title: `Nuh-uh`,
      description: `There is no game yet, what do you expect to find here?`,
    });
  };

  return (
    <Card variant={'pressable'} colorPalette={'blue'} onClick={handleClick}>
      <IconContainer size={'lg'} colorPalette={'blue'} mx={'auto'} mb={6}>
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
