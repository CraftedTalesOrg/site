import { createFileRoute } from '@tanstack/react-router';
import {
  Route as RouteIcon,
  Server,
  Shield,
  Sparkles,
  Waves,
  Zap
} from 'lucide-react';
import { Button, Card, H1, H3, Paragraph, XStack, YStack } from 'tamagui';
import type { JSX } from 'react';

export const Route = createFileRoute('/')({ component: App });

function App(): JSX.Element {
  const features = [
    {
      icon: <Zap size={48} color={'$primary'} />,
      title: 'Powerful Server Functions',
      description:
        'Write server-side code that seamlessly integrates with your client components. Type-safe, secure, and simple.',
    },
    {
      icon: <Server size={48} color={'$primary'} />,
      title: 'Flexible Server Side Rendering',
      description:
        'Full-document SSR, streaming, and progressive enhancement out of the box. Control exactly what renders where.',
    },
    {
      icon: <RouteIcon size={48} color={'$primary'} />,
      title: 'API Routes',
      description:
        'Build type-safe API endpoints alongside your application. No separate backend needed.',
    },
    {
      icon: <Shield size={48} color={'$primary'} />,
      title: 'Strongly Typed Everything',
      description:
        'End-to-end type safety from server to client. Catch errors before they reach production.',
    },
    {
      icon: <Waves size={48} color={'$primary'} />,
      title: 'Full Streaming Support',
      description:
        'Stream data from server to client progressively. Perfect for AI applications and real-time updates.',
    },
    {
      icon: <Sparkles size={48} color={'$primary'} />,
      title: 'Next Generation Ready',
      description:
        'Built from the ground up for modern web applications. Deploy anywhere JavaScript runs.',
    },
  ];

  return (
    <YStack flex={1} bg={'$background'}>
      {/* Hero Section */}
      <YStack py={'$10'} ai={'center'} gap={'$4'} px={'$4'}>
        <H1 jc={'center'} size={'$10'} color={'$color'}>
          CraftedTales
        </H1>
        <Paragraph jc={'center'} size={'$5'} maxW={600}>
          A modern, type-safe, full-stack React framework for building high-performance web applications.
        </Paragraph>
        <XStack gap={'$3'}>
          <Button size={'$5'}>Get Started</Button>
          <Button size={'$5'} variant={'outlined'}>Documentation</Button>
        </XStack>
      </YStack>

      {/* Features Grid */}
      <XStack flexWrap={'wrap'} jc={'center'} gap={'$4'} p={'$4'} maxW={1200} ai={'center'}>
        {features.map((feature, i) => (
          <Card key={i} p={'$5'} width={350} bordered elevate hoverStyle={{ scale: 1.02 }}>
            <Card.Header gap={'$3'}>
              {feature.icon}
              <H3>{feature.title}</H3>
            </Card.Header>
            <Paragraph>
              {feature.description}
            </Paragraph>
          </Card>
        ))}
      </XStack>
    </YStack>
  );
}
