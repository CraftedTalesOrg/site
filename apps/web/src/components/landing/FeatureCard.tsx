import { Box, Text } from '@chakra-ui/react';
import type { JSX } from 'react';

interface FeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <Box
      bg={'bg.card'}
      border={'1px solid'}
      borderColor={'border.default'}
      borderRadius={'20px'}
      p={10}
      transition={'all 0.4s ease'}
      _hover={{
        borderColor: 'brand.green.500',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)',
      }}
    >
      <Box
        width={'60px'}
        height={'60px'}
        bgGradient={'to-br'}
        gradientFrom={'rgba(16, 185, 129, 0.15)'}
        gradientTo={'rgba(0, 212, 255, 0.15)'}
        borderRadius={'14px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        fontSize={'1.75rem'}
        color={'brand.green.500'}
        mb={6}
      >
        {icon}
      </Box>
      <Text
        fontFamily={'heading'}
        fontSize={'1.35rem'}
        fontWeight={'600'}
        mb={3}
      >
        {title}
      </Text>
      <Text color={'text.secondary'} fontSize={'0.95rem'}>
        {description}
      </Text>
    </Box>
  );
}
