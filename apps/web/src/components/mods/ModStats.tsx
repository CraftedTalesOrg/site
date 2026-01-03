import { Text } from '@/theming/components';
import { HStack, Icon } from '@chakra-ui/react';
import { PublicMod } from '@craftedtales/api/schemas/mods';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Download, Heart } from 'lucide-react';
import { JSX } from 'react';

interface ModStatsProps {
  mod: PublicMod;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }

  return num.toString();
}

export function ModStats({ mod }: ModStatsProps): JSX.Element {
  const { likes, downloads, updatedAt } = mod;

  return (
    <>
      <HStack gap={1}>
        <Icon color={'text.primary'} size={'md'}>
          <Download />
        </Icon>
        <Text variant={'cardTitle'}>{formatNumber(downloads)}</Text>
        <Text variant={'cardBody'}>{'downloads'}</Text>
      </HStack>
      <HStack gap={1} mr={'auto'}>
        <Icon color={'text.primary'} size={'md'}>
          <Heart />
        </Icon>
        <Text variant={'cardTitle'}>{formatNumber(likes)}</Text>
        <Text variant={'cardBody'}>{'likes'}</Text>
      </HStack>
      <HStack gap={1}>
        <Icon color={'text.primary'} size={'md'}>
          <Calendar />
        </Icon>
        <Text variant={'cardBody'}>{'Updated'}</Text>
        <Text variant={'cardBody'}>{formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}</Text>
      </HStack>
    </>
  );
}
