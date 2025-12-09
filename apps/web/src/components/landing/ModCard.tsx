import { Box, Text, Flex } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Download, Star } from 'lucide-react';

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
    <Box
      bg={'bg.card'}
      border={'1px solid'}
      borderColor={'border.default'}
      borderRadius={'16px'}
      overflow={'hidden'}
      transition={'all 0.4s ease'}
      cursor={'pointer'}
      _hover={{
        transform: 'translateY(-5px)',
        borderColor: 'brand.purple.500',
        boxShadow: 'glow.purple',
      }}
    >
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
          <Box
            position={'absolute'}
            top={4}
            right={4}
            px={3}
            py={'0.35rem'}
            bg={'brand.orange.500'}
            color={'white'}
            borderRadius={'20px'}
            fontSize={'0.7rem'}
            fontWeight={'700'}
            textTransform={'uppercase'}
          >
            {badge}
          </Box>
        )}
      </Box>
      <Box p={6}>
        <Box
          display={'inline-block'}
          px={3}
          py={1}
          bg={'rgba(139, 92, 246, 0.15)'}
          color={'brand.purple.500'}
          borderRadius={'20px'}
          fontSize={'0.7rem'}
          fontWeight={'600'}
          textTransform={'uppercase'}
          mb={3}
        >
          {category}
        </Box>
        <Text
          fontFamily={'heading'}
          fontSize={'1.35rem'}
          fontWeight={'600'}
          mb={2}
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
    </Box>
  );
}
