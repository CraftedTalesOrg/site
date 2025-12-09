import { YStack, XStack } from 'tamagui';
import type { JSX } from 'react';
import {
  Code2,
  Download,
  Gauge,
  Rocket,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { SectionHeader } from '../SectionHeader';

const features = [
  {
    icon: <Download size={28} color={'var(--primary)'} />,
    title: 'Fast Downloads',
    description: 'Lightning-fast CDN-powered downloads with no wait times or speed limits.',
  },
  {
    icon: <ShieldCheck size={28} color={'var(--primary)'} />,
    title: 'Verified Mods',
    description: 'All mods are scanned and verified to ensure they are safe and malware-free.',
  },
  {
    icon: <Rocket size={28} color={'var(--primary)'} />,
    title: 'Easy Installation',
    description: 'One-click install with our mod manager or simple manual installation guides.',
  },
  {
    icon: <Users size={28} color={'var(--primary)'} />,
    title: 'Active Community',
    description: 'Join thousands of creators and players in our vibrant Discord community.',
  },
  {
    icon: <Code2 size={28} color={'var(--primary)'} />,
    title: 'Developer Tools',
    description: 'Comprehensive SDK and documentation to help you create amazing mods.',
  },
  {
    icon: <Gauge size={28} color={'var(--primary)'} />,
    title: 'Performance First',
    description: 'Optimized infrastructure ensures mods load quickly and run smoothly.',
  },
];

export function FeaturesSection(): JSX.Element {
  return (
    <YStack bg={'$backgroundSubtle'} py={'$12'} px={'$4'}>
      <SectionHeader
        tag={'Why CraftedTales?'}
        title={'Built for the Community'}
        subtitle={'Everything you need to discover, download, and share Hytale mods.'}
      />
      <XStack
        flexWrap={'wrap'}
        jc={'center'}
        gap={'$6'}
        maxWidth={1200}
        mx={'auto'}
      >
        {features.map(feature => (
          <YStack key={feature.title} w={'100%'} $sm={{ w: '48%' }} $md={{ w: '31%' }}>
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </YStack>
        ))}
      </XStack>
    </YStack>
  );
}
