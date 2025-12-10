import { Box, Text, Flex } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Download, Star } from 'lucide-react';
import { Card, Badge } from '@/theming/components';

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
    <Card variant={'mod'} colorPalette={'gold'}>
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
        <Text
          fontFamily={'heading'}
          fontSize={'1.35rem'}
          fontWeight={'600'}
          mb={2}
          color={'text.primary'}
        >
          {title}
        </Text>
        <Text
          fontSize={'0.9rem'}
          color={'text.secondary'}
          mb={4}
          maxLines={2}
        >
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
            <Text>{downloads}</Text>
          </Flex>
          <Flex align={'center'} gap={2} fontSize={'0.85rem'} color={'text.muted'}>
            <Star size={16} />
            <Text>{rating}</Text>
          </Flex>
        </Flex>
      </Box>
    </Card>
  );
}
