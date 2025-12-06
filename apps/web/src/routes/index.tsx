import { createFileRoute } from '@tanstack/react-router';
import {
  Blocks,
  Boxes,
  Code2,
  Download,
  Gauge,
  Image,
  Package,
  Puzzle,
  Rocket,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import { Button, H1, H2, Paragraph, XStack, YStack } from 'tamagui';
import {
  CategoryCard,
  FeatureCard,
  ModCard,
  SearchBox,
  StatItem,
} from '../components/landing';
import { SectionHeader } from '../components/SectionHeader';
import type { JSX } from 'react';

export const Route = createFileRoute('/')({ component: App });

// Data
const stats = [
  { value: '2,500+', label: 'Mods' },
  { value: '1.2M+', label: 'Downloads' },
  { value: '15K+', label: 'Creators' },
];

const categories = [
  { icon: <Puzzle size={32} color={'var(--accent)'} />, name: 'Mods', count: 1234 },
  { icon: <Package size={32} color={'var(--accent)'} />, name: 'Plugins', count: 567 },
  { icon: <Image size={32} color={'var(--accent)'} />, name: 'Resource Packs', count: 890 },
  { icon: <Boxes size={32} color={'var(--accent)'} />, name: 'Modpacks', count: 234 },
  { icon: <Zap size={32} color={'var(--accent)'} />, name: 'Shaders', count: 123 },
  { icon: <Blocks size={32} color={'var(--accent)'} />, name: 'Maps', count: 456 },
  { icon: <Code2 size={32} color={'var(--accent)'} />, name: 'Tools', count: 78 },
  { icon: <Users size={32} color={'var(--accent)'} />, name: 'Server Plugins', count: 345 },
];

const featuredMods = [
  {
    icon: <Puzzle size={64} color={'var(--primary)'} />,
    title: 'Advanced Crafting',
    category: 'Gameplay',
    description: 'Adds over 200 new crafting recipes and introduces a tier-based crafting system.',
    downloads: 125000,
    rating: 4.8,
    badge: 'Popular',
  },
  {
    icon: <Zap size={64} color={'var(--primary)'} />,
    title: 'Enhanced Combat',
    category: 'Combat',
    description: 'Completely overhauls the combat system with new moves, combos, and weapons.',
    downloads: 98000,
    rating: 4.9,
    badge: 'Featured',
  },
  {
    icon: <Blocks size={64} color={'var(--primary)'} />,
    title: 'Building Expansion',
    category: 'Building',
    description: 'Adds 500+ new building blocks, furniture, and decorative items.',
    downloads: 87000,
    rating: 4.7,
  },
  {
    icon: <Users size={64} color={'var(--primary)'} />,
    title: 'NPC Overhaul',
    category: 'NPCs',
    description: 'Makes NPCs smarter with improved AI, schedules, and interaction systems.',
    downloads: 76000,
    rating: 4.6,
  },
  {
    icon: <Image size={64} color={'var(--primary)'} />,
    title: 'HD Textures Pro',
    category: 'Textures',
    description: 'Ultra high-definition texture pack with 4K resolution support.',
    downloads: 156000,
    rating: 4.9,
    badge: 'New',
  },
  {
    icon: <Gauge size={64} color={'var(--primary)'} />,
    title: 'Performance Boost',
    category: 'Optimization',
    description: 'Optimizes game performance with up to 60% FPS improvement.',
    downloads: 234000,
    rating: 4.8,
  },
];

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

function App(): JSX.Element {
  return (
    <YStack flex={1} bg={'$background'} pt={80}>
      {/* Hero Section */}
      <YStack minHeight={600} ai={'center'} jc={'center'} px={'$4'} py={'$10'}>
        <YStack ai={'center'} gap={'$8'} maxWidth={800}>
          <YStack gap={'$4'} ai={'center'}>
            <H1 size={'$10'} fontWeight={'700'} textAlign={'center'} lineHeight={'$10'}>
              Discover the Best{' '}
              <H1
                size={'$10'}
                fontWeight={'700'}
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--accent), var(--primary))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                Hytale Mods
              </H1>
            </H1>
            <H2 size={'$6'} fontWeight={'400'} color={'$mutedForeground'} textAlign={'center'} maxWidth={600}>
              Download mods, plugins, and resource packs from the largest Hytale modding community.
            </H2>
          </YStack>

          {/* CTA Buttons */}
          <XStack gap={'$4'} flexWrap={'wrap'} jc={'center'}>
            <Button
              size={'$5'}
              bg={'$primary'}
              color={'white'}
              px={'$8'}
              shadowColor={'$accent'}
              shadowRadius={30}
              shadowOpacity={0.4}
              hoverStyle={{ bg: '$primaryHover', transform: 'translateY(-2px)' }}>
              Explore Mods
            </Button>
            <Button
              size={'$5'}
              bg={'transparent'}
              borderWidth={1}
              borderColor={'$borderColor'}
              color={'$color'}
              px={'$8'}
              hoverStyle={{ borderColor: '$accent', bg: '$backgroundHover' }}>
              Upload Your Mod
            </Button>
          </XStack>

          {/* Stats */}
          <XStack gap={'$10'} mt={'$6'} flexWrap={'wrap'} jc={'center'}>
            {stats.map(stat => (
              <StatItem key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </XStack>
        </YStack>
      </YStack>

      {/* Categories Section */}
      <YStack bg={'$backgroundSubtle'} py={'$12'} px={'$4'}>
        <SectionHeader
          tag={'Categories'}
          title={'Explore by Category'}
          subtitle={'Find exactly what you\'re looking for in our organized collection.'}
        />
        <XStack
          flexWrap={'wrap'}
          jc={'center'}
          gap={'$5'}
          maxWidth={1200}
          mx={'auto'}>
          {categories.map(category => (
            <YStack key={category.name} w={'100%'} $sm={{ w: '48%' }} $md={{ w: '23%' }}>
              <CategoryCard
                icon={category.icon}
                name={category.name}
                count={category.count}
              />
            </YStack>
          ))}
        </XStack>
      </YStack>

      {/* Featured Mods Section */}
      <YStack py={'$12'} px={'$4'}>
        <SectionHeader
          tag={'Featured'}
          title={'Popular Mods'}
          subtitle={'The most downloaded and highest rated mods from our community.'}
        />

        {/* Search Box */}
        <YStack maxWidth={600} mx={'auto'} mb={'$10'} w={'100%'}>
          <SearchBox placeholder={'Search mods, plugins, textures...'} />
        </YStack>

        <XStack
          flexWrap={'wrap'}
          jc={'center'}
          gap={'$6'}
          maxWidth={1200}
          mx={'auto'}>
          {featuredMods.map(mod => (
            <YStack key={mod.title} w={'100%'} $sm={{ w: '48%' }} $md={{ w: '31%' }}>
              <ModCard
                icon={mod.icon}
                title={mod.title}
                category={mod.category}
                description={mod.description}
                downloads={mod.downloads}
                rating={mod.rating}
                badge={mod.badge}
              />
            </YStack>
          ))}
        </XStack>
      </YStack>

      {/* Features Section */}
      <YStack bg={'$backgroundSubtle'} py={'$12'} px={'$4'}>
        <SectionHeader
          tag={'Why ModsTale?'}
          title={'Built for the Community'}
          subtitle={'Everything you need to discover, download, and share Hytale mods.'}
        />
        <XStack
          flexWrap={'wrap'}
          jc={'center'}
          gap={'$6'}
          maxWidth={1200}
          mx={'auto'}>
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

      {/* CTA Section */}
      <YStack py={'$12'} px={'$4'}>
        <YStack
          maxWidth={900}
          mx={'auto'}
          w={'100%'}
          bg={'$backgroundStrong'}
          borderWidth={1}
          borderColor={'$borderColor'}
          borderRadius={'$6'}
          p={'$10'}
          ai={'center'}
          gap={'$6'}
          position={'relative'}
          overflow={'hidden'}>
          {/* Gradient overlay */}
          <YStack
            position={'absolute'}
            top={0}
            left={0}
            right={0}
            bottom={0}
            opacity={0.1}
            style={{
              background: 'radial-gradient(circle at center, var(--accent) 0%, transparent 70%)',
            }}
          />

          <YStack zIndex={1} ai={'center'} gap={'$4'}>
            <H2 size={'$9'} fontWeight={'700'} textAlign={'center'}>
              Ready to Share Your Creation?
            </H2>
            <Paragraph size={'$5'} color={'$mutedForeground'} textAlign={'center'} maxWidth={600}>
              Join thousands of creators and share your mods with the Hytale community. It's free and takes less than a minute.
            </Paragraph>
          </YStack>

          <Button
            size={'$5'}
            bg={'$primary'}
            color={'white'}
            px={'$10'}
            zIndex={1}
            shadowColor={'$accent'}
            shadowRadius={30}
            shadowOpacity={0.4}
            hoverStyle={{ bg: '$primaryHover', transform: 'translateY(-2px)' }}>
            Start Creating
          </Button>
        </YStack>
      </YStack>
    </YStack>
  );
}
