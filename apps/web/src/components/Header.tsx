import { ButtonLink } from '@craftedtales/ui';
import { Link } from '@tanstack/react-router';
import { Boxes, Moon, Package, Puzzle, Sun, Upload, Users } from 'lucide-react';
import { useState } from 'react';
import { Button, H2, Text, XStack, YStack } from 'tamagui';
import { useTheme } from '../hooks/useTheme';
import type { JSX } from 'react';

const navItems = [
  { label: 'Mods', icon: Puzzle, href: '/mods' },
  { label: 'Plugins', icon: Package, href: '/plugins' },
  { label: 'Resource Packs', icon: Boxes, href: '/resource-packs' },
  { label: 'Community', icon: Users, href: '/community' },
] as const;

export default function Header(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const [isSignedIn] = useState(true); // Fake sign-in state for now

  return (
    <XStack
      tag={'header'}
      position={'absolute'}
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      ai={'center'}
      jc={'space-between'}
      py={'$3'}
      px={'$6'}
      borderBottomWidth={1}
      borderBottomColor={'$borderColor'}
      bg={'$background'}
      style={{
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(var(--background), 0.85)',
        position: 'fixed',
      }}>
      {/* Logo */}
      <Link to={'/'}>
        <XStack ai={'center'} gap={'$3'}>
          <YStack
            w={42}
            h={42}
            ai={'center'}
            jc={'center'}
            borderRadius={'$3'}
            bg={'$primary'}
            shadowColor={'$accent'}
            shadowRadius={30}
            shadowOpacity={0.3}>
            <Text color={'white'} fontSize={20}>
              🎮
            </Text>
          </YStack>
          <H2
            size={'$6'}
            fontWeight={'700'}
            style={{
              backgroundImage: 'linear-gradient(135deg, var(--accent), var(--primary))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            ModsTale
          </H2>
        </XStack>
      </Link>

      {/* Navigation Tabs */}
      <XStack gap={'$6'} ai={'center'} display={'none'} $md={{ display: 'flex' }}>
        {navItems.map(item => (
          <ButtonLink
            key={item.label}
            to={item.href}
            unstyled
            color={'$mutedForeground'}
            fontWeight={'500'}
            fontSize={'$4'}>
            {item.label}
          </ButtonLink>
        ))}
      </XStack>

      {/* Right side: Auth + Theme + CTA */}
      <XStack gap={'$3'} ai={'center'}>
        {isSignedIn ? (
          <>
            <Button
              size={'$3'}
              bg={'transparent'}
              borderWidth={1}
              borderColor={'$borderColor'}
              hoverStyle={{ borderColor: '$accent', bg: '$backgroundHover' }}>
              Sign In
            </Button>
            <Button
              size={'$3'}
              bg={'$primary'}
              color={'white'}
              icon={<Upload size={16} />}
              shadowColor={'$accent'}
              shadowRadius={20}
              shadowOpacity={0.3}
              hoverStyle={{ bg: '$primaryHover', transform: 'translateY(-2px)' }}>
              Upload Mod
            </Button>
          </>
        ) : (
          <Button
            size={'$3'}
            bg={'$primary'}
            color={'white'}>
            Sign In
          </Button>
        )}

        <Button
          size={'$3'}
          circular
          bg={'transparent'}
          icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={'Toggle theme'} />
      </XStack>
    </XStack>
  );
}
