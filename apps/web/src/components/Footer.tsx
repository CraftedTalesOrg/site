import { Link } from '@tanstack/react-router';
import { Github, MessageCircle, Twitter } from 'lucide-react';
import { Button, H3, Paragraph, SizableText, View, XStack, YStack } from 'tamagui';
import type { JSX } from 'react';

const footerLinks = {
  explore: [
    { label: 'Mods', href: '/mods' },
    { label: 'Plugins', href: '/plugins' },
    { label: 'Resource Packs', href: '/resource-packs' },
    { label: 'Modpacks', href: '/modpacks' },
  ],
  community: [
    { label: 'Discord', href: '/discord' },
    { label: 'Forums', href: '/forums' },
    { label: 'Creators', href: '/creators' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'DMCA', href: '/dmca' },
    { label: 'Contact', href: '/contact' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: MessageCircle, href: 'https://discord.gg', label: 'Discord' },
];

export default function Footer(): JSX.Element {
  return (
    <View bg={'$backgroundSubtle'} borderTopWidth={1} borderTopColor={'$borderColor'}>
      <YStack tag={'footer'} py={'$10'} px={'$6'} maxWidth={1400} mx={'auto'} w={'100%'}>
        {/* Main footer content */}
        <XStack flexWrap={'wrap'} gap={'$10'} mb={'$10'}>
          {/* Brand section */}
          <YStack flex={1} minWidth={280} gap={'$4'}>
            <XStack ai={'center'} gap={'$3'}>
              <YStack
                w={42}
                h={42}
                ai={'center'}
                jc={'center'}
                borderRadius={'$3'}
                bg={'$primary'}>
                <SizableText fontSize={20}>🎮</SizableText>
              </YStack>
              <H3
                size={'$6'}
                fontWeight={'700'}
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--accent), var(--primary))',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                ModsTale
              </H3>
            </XStack>
            <Paragraph size={'$3'} color={'$mutedForeground'} maxWidth={300}>
              The #1 community for Hytale mods, plugins, and resource packs. Built by modders, for modders.
            </Paragraph>
          </YStack>

          {/* Explore links */}
          <YStack minWidth={150} gap={'$4'}>
            <H3 size={'$4'} fontWeight={'600'}>Explore</H3>
            <YStack gap={'$3'}>
              {footerLinks.explore.map(link => (
                <Link key={link.label} to={link.href}>
                  <SizableText size={'$3'} color={'$mutedForeground'} hoverStyle={{ color: '$color' }}>
                    {link.label}
                  </SizableText>
                </Link>
              ))}
            </YStack>
          </YStack>

          {/* Community links */}
          <YStack minWidth={150} gap={'$4'}>
            <H3 size={'$4'} fontWeight={'600'}>Community</H3>
            <YStack gap={'$3'}>
              {footerLinks.community.map(link => (
                <Link key={link.label} to={link.href}>
                  <SizableText size={'$3'} color={'$mutedForeground'} hoverStyle={{ color: '$color' }}>
                    {link.label}
                  </SizableText>
                </Link>
              ))}
            </YStack>
          </YStack>

          {/* Legal links */}
          <YStack minWidth={150} gap={'$4'}>
            <H3 size={'$4'} fontWeight={'600'}>Legal</H3>
            <YStack gap={'$3'}>
              {footerLinks.legal.map(link => (
                <Link key={link.label} to={link.href}>
                  <SizableText size={'$3'} color={'$mutedForeground'} hoverStyle={{ color: '$color' }}>
                    {link.label}
                  </SizableText>
                </Link>
              ))}
            </YStack>
          </YStack>
        </XStack>

        {/* Bottom bar */}
        <XStack
          pt={'$6'}
          borderTopWidth={1}
          borderTopColor={'$borderColor'}
          jc={'space-between'}
          ai={'center'}
          flexWrap={'wrap'}
          gap={'$4'}>
          <SizableText size={'$2'} color={'$mutedForeground'}>
            © {new Date().getFullYear()} ModsTale. All rights reserved.
          </SizableText>

          <XStack gap={'$3'}>
            {socialLinks.map(social => (
              <Button
                key={social.label}
                size={'$3'}
                circular
                bg={'$backgroundStrong'}
                borderWidth={1}
                borderColor={'$borderColor'}
                icon={<social.icon size={18} />}
                aria-label={social.label}
                hoverStyle={{ borderColor: '$accent', bg: '$backgroundHover' }}
              />
            ))}
          </XStack>
        </XStack>
      </YStack>
    </View>
  );
}
