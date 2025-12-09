import { Button, H1, H2, XStack, YStack } from 'tamagui';
import type { JSX } from 'react';
import { StatItem } from './StatItem';

const stats = [
  { value: '2,500+', label: 'Mods' },
  { value: '1.2M+', label: 'Downloads' },
  { value: '15K+', label: 'Creators' },
];

export function HeroSection(): JSX.Element {
  return (
    <YStack minHeight={700} ai={'center'} jc={'center'} px={'$4'} py={'$10'}>
      <XStack maxWidth={1400} width={'100%'} gap={'$8'} ai={'center'}>
        {/* Text Content */}
        <YStack flex={1} gap={'$6'}>
          <YStack gap={'$4'}>
            <H1 size={'$10'} fontWeight={'700'} lineHeight={'$10'}>
              {'Discover the Best'}
              {' '}
              <H1
                size={'$10'}
                fontWeight={'700'}
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--accent), var(--primary))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {'Hytale Mods'}
              </H1>
            </H1>
            <H2 size={'$6'} fontWeight={'400'} color={'$mutedForeground'} maxWidth={500}>
              {'Download mods, plugins, and resource packs from the largest Hytale modding community.'}
            </H2>
          </YStack>

          {/* CTA Buttons */}
          <XStack gap={'$4'} flexWrap={'wrap'}>
            <Button
              size={'$5'}
              bg={'$primary'}
              color={'white'}
              px={'$8'}
              shadowColor={'$accent'}
              shadowRadius={30}
              shadowOpacity={0.4}
              hoverStyle={{ bg: '$primaryHover', transform: 'translateY(-2px)' }}
            >
              {'Explore Mods'}
            </Button>
            <Button
              size={'$5'}
              bg={'transparent'}
              borderWidth={1}
              borderColor={'$borderColor'}
              color={'$color'}
              px={'$8'}
              hoverStyle={{ borderColor: '$accent', bg: '$backgroundHover' }}
            >
              {'Upload Your Mod'}
            </Button>
          </XStack>

          {/* Stats */}
          <XStack gap={'$10'} mt={'$4'} flexWrap={'wrap'}>
            {stats.map(stat => (
              <StatItem key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </XStack>
        </YStack>

        {/* Visual Content - Floating Cards */}
        <YStack flex={1} position={'relative'} minHeight={400}>
          {/* First Card */}
          <YStack
            position={'absolute'}
            top={0}
            left={0}
            w={280}
            h={200}
            bg={'$backgroundStrong'}
            borderWidth={1}
            borderColor={'$borderColor'}
            borderRadius={'$4'}
            p={'$4'}
            gap={'$3'}
            zIndex={3}
            shadowColor={'$background'}
            shadowRadius={20}
            shadowOpacity={0.5}
            style={{
              animation: 'float 6s ease-in-out infinite',
            }}
          >
            <YStack h={120} bg={'$backgroundSubtle'} borderRadius={'$3'} ai={'center'} jc={'center'}>
              {/* Placeholder for Puzzle icon */}
              <div style={{ width: 64, height: 64, background: 'var(--primary)' }} />
            </YStack>
            <YStack gap={'$1'}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {'Advanced Crafting'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--mutedForeground)' }}>
                {'Gameplay'}
              </div>
            </YStack>
          </YStack>

          {/* Second Card */}
          <YStack
            position={'absolute'}
            top={60}
            right={0}
            w={260}
            h={200}
            bg={'$backgroundStrong'}
            borderWidth={1}
            borderColor={'$borderColor'}
            borderRadius={'$4'}
            p={'$4'}
            gap={'$3'}
            zIndex={2}
            shadowColor={'$background'}
            shadowRadius={20}
            shadowOpacity={0.5}
            style={{
              animation: 'float 7s ease-in-out infinite',
            }}
          >
            <YStack h={120} bg={'$backgroundSubtle'} borderRadius={'$3'} ai={'center'} jc={'center'}>
              <div style={{ width: 64, height: 64, background: 'var(--primary)' }} />
            </YStack>
            <YStack gap={'$1'}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {'Enhanced Combat'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--mutedForeground)' }}>
                {'Combat'}
              </div>
            </YStack>
          </YStack>

          {/* Third Card */}
          <YStack
            position={'absolute'}
            bottom={20}
            left={60}
            w={240}
            h={200}
            bg={'$backgroundStrong'}
            borderWidth={1}
            borderColor={'$borderColor'}
            borderRadius={'$4'}
            p={'$4'}
            gap={'$3'}
            zIndex={1}
            shadowColor={'$background'}
            shadowRadius={20}
            shadowOpacity={0.5}
            style={{
              animation: 'float 8s ease-in-out infinite',
            }}
          >
            <YStack h={120} bg={'$backgroundSubtle'} borderRadius={'$3'} ai={'center'} jc={'center'}>
              <div style={{ width: 64, height: 64, background: 'var(--primary)' }} />
            </YStack>
            <YStack gap={'$1'}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {'Building Expansion'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--mutedForeground)' }}>
                {'Building'}
              </div>
            </YStack>
          </YStack>
        </YStack>
      </XStack>
    </YStack>
  );
}
