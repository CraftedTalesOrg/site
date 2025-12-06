import { Card } from '@craftedtales/ui';
import { H3, Paragraph, YStack } from 'tamagui';
import type { JSX, ReactNode } from 'react';

interface CategoryCardProps {
  icon: ReactNode;
  name: string;
  count: number;
}

export function CategoryCard({ icon, name, count }: CategoryCardProps): JSX.Element {
  return (
    <Card
      ai={'center'}
      gap={'$4'}
      p={'$6'}
      hoverStyle={{
        borderColor: '$accent',
        transform: 'translateY(-8px)',
        shadowColor: '$accent',
        shadowRadius: 30,
        shadowOpacity: 0.3,
      }}>
      <YStack
        w={70}
        h={70}
        ai={'center'}
        jc={'center'}
        bg={'$backgroundSubtle'}
        borderRadius={'$4'}>
        {icon}
      </YStack>
      <YStack ai={'center'} gap={'$1'}>
        <H3 size={'$6'} fontWeight={'600'}>
          {name}
        </H3>
        <Paragraph size={'$3'} color={'$mutedForeground'}>
          {count.toLocaleString()} mods
        </Paragraph>
      </YStack>
    </Card>
  );
}
