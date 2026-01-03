import { Box, Flex } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Download, Star } from 'lucide-react';
import { Card, Badge, Text } from '@/theming/components';

interface ModCardProps {
  icon: JSX.Element;
  badge?: string;
  category: string;
  title: string;
  description: string;
  downloads: string;
  rating: string;
}

export default function ModCard({
  icon,
  badge,
  category,
  title,
  description,
  downloads,
  rating,
}: ModCardProps): JSX.Element {
  return (
    <Card variant={'animatedPressable'} colorPalette={'gold'} p={8}>
      <Box
        width={'100%'}
        height={'180px'}
        bgGradient={'to-br'}
        gradientFrom={'bg.tertiary'}
        gradientTo={'bg.secondary'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        fontSize={'4rem'}
        color={'text.muted'}
        position={'relative'}
      >
        {icon}
        {badge && (
          <Badge variant={'status'} colorPalette={'orange'}>
            {badge}
          </Badge>
        )}
      </Box>
      <Box p={6}>
        <Badge variant={'tag'} colorPalette={'gold'} mb={3}>
          {category}
        </Badge>
        <Text variant={'cardTitle'} mb={2}>
          {title}
        </Text>
        <Text variant={'cardBody'} mb={4} maxLines={2}>
          {description}
        </Text>
        <Flex
          gap={6}
          pt={4}
          borderTop={'1px solid'}
          borderColor={'border.default'}
        >
          <Flex align={'center'} gap={2} fontSize={'0.85rem'} color={'text.muted'}>
            <Download size={16} />
            <Text variant={'caption'}>{downloads}</Text>
          </Flex>
          <Flex align={'center'} gap={2} fontSize={'0.85rem'} color={'text.muted'}>
            <Star size={16} />
            <Text variant={'caption'}>{rating}</Text>
          </Flex>
        </Flex>
      </Box>
    </Card>
  );
}
