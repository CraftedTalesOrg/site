import { Box } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Sword, Wand2, Package } from 'lucide-react';
import { Card, Badge, Text } from '@/theming/components';

interface FloatingCard {
  icon: JSX.Element;
  tag: string;
  title: string;
  meta: string;
  delay: number;
  animation: string;
}

const cards: FloatingCard[] = [
  {
    icon: <Sword size={48} />,
    tag: 'Combat',
    title: 'Epic Weapons Mod',
    meta: '2.5k downloads',
    delay: 0,
    animation: 'floatingCard1',
  },
  {
    icon: <Wand2 size={48} />,
    tag: 'Magic',
    title: 'Spell Casting',
    meta: '1.8k downloads',
    delay: 1,
    animation: 'floatingCard2',
  },
  {
    icon: <Package size={48} />,
    tag: 'Items',
    title: 'Resource Pack',
    meta: '3.2k downloads',
    delay: 2,
    animation: 'floatingCard3',
  },
];

export default function FloatingCards(): JSX.Element {
  return (
    <Box position={'relative'} width={'100%'} height={'450px'}>
      {cards.map((card, index) => (
        <Card
          key={index}
          variant={'floating'}
          width={`${280 - index * 20}px`}
          top={index === 0 ? '0' : index === 1 ? '60px' : 'auto'}
          bottom={index === 2 ? '20px' : 'auto'}
          left={index === 0 ? '0' : index === 2 ? '60px' : 'auto'}
          right={index === 1 ? '0' : 'auto'}
          zIndex={3 - index}
          animationStyle={card.animation}
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
            <Badge variant={'tag'} colorPalette={'blue'} mb={2}>
              {card.tag}
            </Badge>
            <Text variant={'cardTitle'} mb={1}>
              {card.title}
            </Text>
            <Text variant={'caption'}>
              {card.meta}
            </Text>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
