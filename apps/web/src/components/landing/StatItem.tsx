import { H2, Paragraph, YStack } from 'tamagui';
import type { JSX } from 'react';

interface StatItemProps {
  value: string;
  label: string;
}

export function StatItem({ value, label }: StatItemProps): JSX.Element {
  return (
    <YStack ai={'center'}>
      <H2 size={'$9'} fontWeight={'700'} color={'$accent'}>
        {value}
      </H2>
      <Paragraph
        size={'$2'}
        color={'$mutedForeground'}
        textTransform={'uppercase'}
        letterSpacing={1}>
        {label}
      </Paragraph>
    </YStack>
  );
}
