import { createFileRoute } from '@tanstack/react-router';
import {
  Blocks,
  Code2,
  Construction,
  Gauge,
  Gem,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Users
} from 'lucide-react';
import { Button, H1, H2, H3, Paragraph, XStack, YStack } from 'tamagui';
import type { JSX } from 'react';

export const Route = createFileRoute('/')({ component: App });

function App(): JSX.Element {
  const features = [
    {
      icon: <ShieldCheck size={32} color={'#5371b2'} />,
      title: 'Type-Safe Modding',
      description: 'Leverage modern, type-safe scripting to build more reliable and maintainable mods with fewer runtime errors.',
    },
    {
      icon: <Construction size={32} color={'#5371b2'} />,
      title: 'Powerful Tooling',
      description: 'Access a suite of professional-grade tools designed to accelerate your development workflow from concept to release.',
    },
    {
      icon: <Blocks size={32} color={'#5371b2'} />,
      title: 'Seamless Integration',
      description: 'Our mods are built for compatibility, ensuring a smooth experience for players and easy integration for server owners.',
    },
    {
      icon: <Users size={32} color={'#5371b2'} />,
      title: 'Community Driven',
      description: 'Join a vibrant community of creators. Get support, share your work, and collaborate on ambitious new projects.',
    },
    {
      icon: <Gauge size={32} color={'#5371b2'} />,
      title: 'Performance Optimized',
      description: 'We prioritize performance at every step, delivering mods that enhance gameplay without sacrificing frame rates.',
    },
    {
      icon: <Code2 size={32} color={'#5371b2'} />,
      title: 'Extensible APIs',
      description: 'Build upon our work with clean, well-documented APIs that empower you to extend and customize our mods.',
    },
  ];

  return (
    <YStack flex={1} bg={'#010206'}>
      {/* Hero Section */}
      <YStack py={'$10'}>
        <YStack px={'$4'} >
          <YStack
            position={'relative'}
            minHeight={480}
            ai={'center'}
            jc={'center'}
            gap={'$6'}
            overflow={'hidden'}
            borderRadius={'$4'}
            p={'$4'}>
            {/* Background Image Layer */}
            <YStack
              fullscreen
              bg={'#010206'}
              opacity={0.8}
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDQHOrw1G1uNmlUIcYP2DyE5Q677_IiKnrPw1n3tN-e299t2fCHTBG-_1dgedBcdl5cUM96pObiUK4XOppQmNJuyHREEVguYQ3PDDO4wx__T3SsUu1zMyJowJ1Yp-mLRXAd0f391WCh9bTwHHDZVF8tOHcF6R2C2gr1Dw5iOf1i-rgs3ZqV4UOgNn7LQW73i-oF3hiGbyHGxTy6b-stCF26qSJyZQiFYByt7i3CwA_KXrzglRbEiBCrSAS-nkd7uI_FOR6ics6tq38')",
                backgroundBlendMode: 'multiply',
                filter: 'blur(4px)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />

            {/* Content Layer */}
            <YStack zIndex={10} ai={'center'} gap={'$6'}>
              <YStack gap={'$2'} ai={'center'}>
                <H1 size={'$9'} fontWeight={'900'} color={'$color'} textAlign={'center'}>
                  The Next Chapter in Block Gaming.
                </H1>
                <H2 size={'$5'} fontWeight={'normal'} color={'$color'} textAlign={'center'} maxWidth={600}>
                  Premium Hytale mods, built by the veterans who defined the Minecraft era.
                </H2>
              </YStack>
              <Button bg={'#5371b2'} color={'white'} size={'$5'} hoverStyle={{ bg: '#425a8f' }}>
                Explore the Library
              </Button>
            </YStack>
          </YStack>
        </YStack>
      </YStack>

      {/* Legacy Section */}
      <YStack py={'$10'} ai={'center'} gap={'$8'}>
        <H2 size={'$8'} fontWeight={'bold'} textAlign={'center'} maxWidth={700} px={'$4'}>
          Forged in the fires of Minecraft server development, refined for the Hytale engine.
        </H2>

        <YStack width={'100%'} maxWidth={800} px={'$4'}>
          <YStack gap={'$0'}>
            {/* Timeline Item 1 */}
            <XStack gap={'$4'}>
              <YStack ai={'center'} width={40}>
                <YStack p={'$2'} bg={'#0d0f17'} borderRadius={'$10'} borderWidth={1} borderColor={'#181c2b'}>
                  <Gem size={24} color={'#5371b2'} />
                </YStack>
                <YStack flex={1} width={1} bg={'#5371b2'} opacity={0.5} />
              </YStack>
              <YStack pb={'$10'} pt={'$2'} flex={1}>
                <H3 size={'$6'} fontWeight={'bold'}>Minecraft Era Mastery</H3>
                <Paragraph size={'$4'}>Decades of combined experience building groundbreaking Minecraft experiences for millions of players.</Paragraph>
              </YStack>
            </XStack>

            {/* Timeline Item 2 */}
            <XStack gap={'$4'}>
              <YStack ai={'center'} width={40}>
                <YStack height={20} width={1} bg={'#5371b2'} opacity={0.5} />
                <YStack p={'$2'} bg={'#0d0f17'} borderRadius={'$10'} borderWidth={1} borderColor={'#181c2b'}>
                  <TrendingUp size={24} color={'#5371b2'} />
                </YStack>
                <YStack flex={1} width={1} bg={'#5371b2'} opacity={0.5} />
              </YStack>
              <YStack py={'$10'} flex={1}>
                <H3 size={'$6'} fontWeight={'bold'}>Transition to Hytale</H3>
                <Paragraph size={'$4'}>Applying our deep knowledge of block game architecture to the powerful and flexible Hytale engine.</Paragraph>
              </YStack>
            </XStack>

            {/* Timeline Item 3 */}
            <XStack gap={'$4'}>
              <YStack ai={'center'} width={40}>
                <YStack height={20} width={1} bg={'#5371b2'} opacity={0.5} />
                <YStack p={'$2'} bg={'#0d0f17'} borderRadius={'$10'} borderWidth={1} borderColor={'#181c2b'}>
                  <Rocket size={24} color={'#5371b2'} />
                </YStack>
              </YStack>
              <YStack pt={'$10'} pb={'$2'} flex={1}>
                <H3 size={'$6'} fontWeight={'bold'}>Future Innovation</H3>
                <Paragraph size={'$4'}>Pioneering the next generation of modded gameplay with robust tools and unparalleled support.</Paragraph>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </YStack>

      {/* Features Grid Section */}
      <YStack py={'$10'} ai={'center'} gap={'$10'}>
        <H2 size={'$8'} fontWeight={'bold'} textAlign={'center'} px={'$4'}>Built for Developers, Loved by Players.</H2>
        <XStack flexWrap={'wrap'} jc={'center'} gap={'$6'} px={'$4'} maxWidth={1200}>
          {features.map((feature, i) => (
            <YStack
              key={i}
              bg={'#0d0f17'}
              p={'$6'}
              borderRadius={'$4'}
              width={'100%'}
              hoverStyle={{ bg: '#181c2b' }}
              gap={'$4'}
              shadowColor={'rgba(0,0,0,0.2)'}
              shadowRadius={10}
              shadowOffset={{ width: 0, height: 4 }}>
              {feature.icon}
              <YStack gap={'$1'}>
                <H3 size={'$5'} fontWeight={'bold'}>{feature.title}</H3>
                <Paragraph size={'$3'} lineHeight={'$4'}>
                  {feature.description}
                </Paragraph>
              </YStack>
            </YStack>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}
