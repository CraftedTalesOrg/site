import type { JSX } from 'react';
import { Card, IconContainer, Text } from '@/theming/components';

interface FeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <Card variant={'animated'} colorPalette={'green'} p={10}>
      <IconContainer size={'md'} colorPalette={'green'} mb={6}>
        {icon}
      </IconContainer>
      <Text variant={'cardTitle'} mb={3}>
        {title}
      </Text>
      <Text variant={'cardBody'}>
        {description}
      </Text>
    </Card>
  );
}
