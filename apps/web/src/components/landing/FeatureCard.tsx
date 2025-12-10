import { Text } from '@chakra-ui/react';
import type { JSX } from 'react';
import { Card, IconContainer } from '@/theming/components';

interface FeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <Card variant={'feature'} colorPalette={'green'} p={10}>
      <IconContainer size={'md'} colorPalette={'green'} mb={6}>
        {icon}
      </IconContainer>
      <Text
        fontFamily={'heading'}
        fontSize={'1.35rem'}
        fontWeight={'600'}
        mb={3}
        color={'text.primary'}
      >
        {title}
      </Text>
      <Text color={'text.secondary'} fontSize={'0.95rem'}>
        {description}
      </Text>
    </Card>
  );
}
