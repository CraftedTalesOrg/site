import { Box, Text } from '@chakra-ui/react';
import type { JSX } from 'react';

interface CategoryCardProps {
  icon: JSX.Element;
  name: string;
  count: string;
}

export default function CategoryCard({ icon, name, count }: CategoryCardProps): JSX.Element {
  return (
    <Box
      bg={'bg.card'}
      border={'1px solid'}
      borderColor={'border.default'}
      borderRadius={'16px'}
      p={8}
      textAlign={'center'}
      transition={'all 0.4s ease'}
      cursor={'pointer'}
      textDecoration={'none'}
      color={'inherit'}
      _hover={{
        transform: 'translateY(-8px)',
        borderColor: 'brand.cyan.500',
        boxShadow: 'glow.cyan',
      }}
    >
      <Box
        width={'70px'}
        height={'70px'}
        mx={'auto'}
        mb={6}
        bgGradient={'to-br'}
        gradientFrom={'rgba(0, 212, 255, 0.15)'}
        gradientTo={'rgba(139, 92, 246, 0.15)'}
        borderRadius={'16px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        fontSize={'2rem'}
        color={'brand.cyan.500'}
        transition={'all 0.4s ease'}
        _groupHover={{
          transform: 'scale(1.1) rotate(5deg)',
          bgGradient: 'to-br',
          gradientFrom: 'rgba(0, 212, 255, 0.25)',
          gradientTo: 'rgba(139, 92, 246, 0.25)',
        }}
      >
        {icon}
      </Box>
      <Text
        fontFamily={'heading'}
        fontSize={'1.25rem'}
        fontWeight={'600'}
        mb={2}
      >
        {name}
      </Text>
      <Text fontSize={'0.85rem'} color={'text.muted'}>
        {count}
      </Text>
    </Box>
  );
}
