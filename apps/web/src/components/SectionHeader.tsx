import { SectionTag, TagText } from '@craftedtales/ui';
import { H2, Paragraph, YStack } from 'tamagui';
import type { JSX } from 'react';

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ tag, title, subtitle }: SectionHeaderProps): JSX.Element {
  return (
    <YStack ai={'center'} gap={'$4'} maxWidth={700} mx={'auto'} mb={'$10'}>
      {tag ? (
        <SectionTag>
          <TagText>{tag}</TagText>
        </SectionTag>
      ) : null}
      <H2 size={'$9'} fontWeight={'700'} textAlign={'center'}>
        {title}
      </H2>
      {subtitle ? (
        <Paragraph size={'$5'} color={'$mutedForeground'} textAlign={'center'}>
          {subtitle}
        </Paragraph>
      ) : null}
    </YStack>
  );
}
