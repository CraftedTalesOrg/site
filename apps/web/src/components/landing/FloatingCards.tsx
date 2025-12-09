import { Box, Text } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Sword, Wand2, Package } from 'lucide-react';

interface FloatingCard {
  icon: JSX.Element;
  tag: string;
  title: string;
  meta: string;
  delay: number;
  animationName: string;
}

const cards: FloatingCard[] = [
  {
    icon: <Sword size={48} />,
    tag: 'Combat',
    title: 'Epic Weapons Mod',
    meta: '2.5k downloads',
    delay: 0,
    animationName: 'float1',
  },
  {
    icon: <Wand2 size={48} />,
    tag: 'Magic',
    title: 'Spell Casting',
    meta: '1.8k downloads',
    delay: 1,
    animationName: 'float2',
  },
  {
    icon: <Package size={48} />,
    tag: 'Items',
    title: 'Resource Pack',
    meta: '3.2k downloads',
    delay: 2,
    animationName: 'float3',
  },
];

export default function FloatingCards(): JSX.Element {
  return (
    <Box position={'relative'} width={'100%'} height={'450px'}>
      {cards.map((card, index) => (
        <Box
          key={index}
          position={'absolute'}
          bg={'bg.card'}
          border={'1px solid'}
          borderColor={'border.default'}
          borderRadius={'16px'}
          overflow={'hidden'}
          boxShadow={'0 20px 50px rgba(0, 0, 0, 0.5)'}
          width={`${280 - index * 20}px`}
          top={index === 0 ? '0' : index === 1 ? '60px' : 'auto'}
          bottom={index === 2 ? '20px' : 'auto'}
          left={index === 0 ? '0' : index === 2 ? '60px' : 'auto'}
          right={index === 1 ? '0' : 'auto'}
          zIndex={3 - index}
          animation={`${card.animationName} ${6 + index}s ease-in-out infinite`}
        >
          <Box
            width={'100%'}
            height={'140px'}
            bgGradient={'to-br'}
            gradientFrom={'bg.tertiary'}
            gradientTo={'bg.secondary'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            fontSize={'3rem'}
            color={'text.muted'}
          >
            {card.icon}
          </Box>
          <Box p={4}>
            <Box
              display={'inline-block'}
              px={3}
              py={1}
              bg={'rgba(0, 212, 255, 0.15)'}
              color={'brand.cyan.500'}
              borderRadius={'20px'}
              fontSize={'0.7rem'}
              fontWeight={'600'}
              textTransform={'uppercase'}
              mb={2}
            >
              {card.tag}
            </Box>
            <Text
              fontFamily={'heading'}
              fontSize={'1.1rem'}
              fontWeight={'600'}
              mb={1}
            >
              {card.title}
            </Text>
            <Text fontSize={'0.75rem'} color={'text.muted'}>
              {card.meta}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
