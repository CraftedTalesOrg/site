import { Card } from '@craftedtales/ui';
import { H3, Paragraph, YStack } from 'tamagui';
import type { JSX, ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <Card
      size={'lg'}
      gap={'$5'}
      hoverStyle={{
        borderColor: '$primary',
        shadowColor: '$primary',
        shadowRadius: 30,
        shadowOpacity: 0.2,
      }}>
      <YStack
        w={60}
        h={60}
        ai={'center'}
        jc={'center'}
        bg={'$backgroundSubtle'}
        borderRadius={'$3'}>
        {icon}
      </YStack>
      <YStack gap={'$2'}>
        <H3 size={'$6'} fontWeight={'600'}>
          {title}
        </H3>
        <Paragraph size={'$4'} color={'$mutedForeground'} lineHeight={'$5'}>
          {description}
        </Paragraph>
      </YStack>
    </Card>
  );
}
