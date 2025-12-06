import { Card } from '@craftedtales/ui';
import { Download, Star } from 'lucide-react';
import { H3, Paragraph, XStack, YStack } from 'tamagui';
import type { JSX, ReactNode } from 'react';

interface ModCardProps {
  icon: ReactNode;
  title: string;
  category: string;
  description: string;
  downloads: number;
  rating: number;
  badge?: string;
}

export function ModCard({
  icon,
  title,
  category,
  description,
  downloads,
  rating,
  badge,
}: ModCardProps): JSX.Element {
  return (
    <Card p={'$0'}>
      {/* Image area */}
      <YStack
        h={180}
        bg={'$backgroundSubtle'}
        ai={'center'}
        jc={'center'}
        position={'relative'}>
        {icon}
        {badge ? (
          <XStack
            position={'absolute'}
            top={'$3'}
            right={'$3'}
            bg={'$accent'}
            px={'$3'}
            py={'$1'}
            borderRadius={'$10'}>
            <Paragraph size={'$1'} fontWeight={'700'} textTransform={'uppercase'} color={'$background'}>
              {badge}
            </Paragraph>
          </XStack>
        ) : null}
      </YStack>

      {/* Content */}
      <YStack p={'$5'} gap={'$3'}>
        <XStack>
          <XStack
            bg={'$backgroundSubtle'}
            px={'$3'}
            py={'$1'}
            borderRadius={'$10'}>
            <Paragraph size={'$1'} fontWeight={'600'} textTransform={'uppercase'} color={'$primary'}>
              {category}
            </Paragraph>
          </XStack>
        </XStack>

        <H3 size={'$6'} fontWeight={'600'}>
          {title}
        </H3>

        <Paragraph
          size={'$3'}
          color={'$mutedForeground'}
          numberOfLines={2}>
          {description}
        </Paragraph>

        {/* Stats */}
        <XStack
          gap={'$5'}
          pt={'$3'}
          borderTopWidth={1}
          borderTopColor={'$borderColor'}>
          <XStack ai={'center'} gap={'$2'}>
            <Download size={16} color={'var(--mutedForeground)'} />
            <Paragraph size={'$3'} color={'$mutedForeground'}>
              {downloads >= 1000 ? `${(downloads / 1000).toFixed(1)}k` : downloads}
            </Paragraph>
          </XStack>
          <XStack ai={'center'} gap={'$2'}>
            <Star size={16} color={'var(--mutedForeground)'} />
            <Paragraph size={'$3'} color={'$mutedForeground'}>
              {rating.toFixed(1)}
            </Paragraph>
          </XStack>
        </XStack>
      </YStack>
    </Card>
  );
}
