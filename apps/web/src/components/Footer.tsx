import type { JSX } from 'react';
import { Box, Flex, Grid, HStack, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

function FooterLink({ to, children }: FooterLinkProps): JSX.Element {
  return (
    <Link
      to={to}
      style={{
        color: 'var(--chakra-colors-text-secondary)',
        fontSize: '0.9rem',
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  );
}

interface SocialLinkProps {
  href: string;
  icon: string;
}

function SocialLink({ href, icon }: SocialLinkProps): JSX.Element {
  return (
    <a
      href={href}
      target={'_blank'}
      rel={'noopener noreferrer'}
      style={{
        display: 'flex',
        width: '40px',
        height: '40px',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--chakra-colors-bg-card)',
        border: '1px solid var(--chakra-colors-border-base)',
        borderRadius: '10px',
        color: 'var(--chakra-colors-text-secondary)',
        textDecoration: 'none',
      }}
    >
      {icon}
    </a>
  );
}

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FooterSection({ title, children }: FooterSectionProps): JSX.Element {
  return (
    <Box>
      <Text
        fontFamily={'heading'}
        fontSize={'lg'}
        fontWeight={'semibold'}
        mb={'6'}
        color={'text.primary'}
      >
        {title}
      </Text>
      <Flex direction={'column'} gap={'3'}>
        {children}
      </Flex>
    </Box>
  );
}

export default function Footer(): JSX.Element {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t($ => $.COMMON.FOOTER.SECTIONS.EXPLORE.TITLE),
      links: [
        { to: '/mods', label: t($ => $.COMMON.FOOTER.SECTIONS.EXPLORE.BROWSE_MODS) },
        { to: '/categories', label: t($ => $.COMMON.FOOTER.SECTIONS.EXPLORE.CATEGORIES) },
        { to: '/popular', label: t($ => $.COMMON.FOOTER.SECTIONS.EXPLORE.POPULAR) },
        { to: '/new', label: t($ => $.COMMON.FOOTER.SECTIONS.EXPLORE.NEW_TRENDING) },
      ],
    },
    {
      title: t($ => $.COMMON.FOOTER.SECTIONS.COMMUNITY.TITLE),
      links: [
        { to: '/creators', label: t($ => $.COMMON.FOOTER.SECTIONS.COMMUNITY.CREATORS) },
        { to: '/discord', label: t($ => $.COMMON.FOOTER.SECTIONS.COMMUNITY.DISCORD) },
        { to: '/forums', label: t($ => $.COMMON.FOOTER.SECTIONS.COMMUNITY.FORUMS) },
        { to: '/blog', label: t($ => $.COMMON.FOOTER.SECTIONS.COMMUNITY.BLOG) },
      ],
    },
    {
      title: t($ => $.COMMON.FOOTER.SECTIONS.SUPPORT.TITLE),
      links: [
        { to: '/help', label: t($ => $.COMMON.FOOTER.SECTIONS.SUPPORT.HELP_CENTER) },
        { to: '/docs', label: t($ => $.COMMON.FOOTER.SECTIONS.SUPPORT.DOCUMENTATION) },
        { to: '/contact', label: t($ => $.COMMON.FOOTER.SECTIONS.SUPPORT.CONTACT) },
        { to: '/terms', label: t($ => $.COMMON.FOOTER.SECTIONS.SUPPORT.TERMS) },
      ],
    },
  ];

  const socialLinks = [
    { href: 'https://twitter.com', icon: '𝕏' },
    { href: 'https://discord.com', icon: '💬' },
    { href: 'https://github.com', icon: '🐙' },
  ];

  return (
    <Box
      as={'footer'}
      position={'relative'}
      zIndex={'1'}
      bg={'bg.secondary'}
      borderTop={'1px solid'}
      borderColor={'border.base'}
      px={'8'}
      pt={'16'}
      pb={'8'}
    >
      <Box maxW={'1200px'} mx={'auto'}>
        {/* Footer Content */}
        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1fr 1fr 1fr' }}
          gap={'16'}
          mb={'12'}
        >
          {/* Brand Section */}
          <Box>
            <Flex align={'center'} gap={'3'} mb={'4'}>
              <Box
                w={'42px'}
                h={'42px'}
                bgGradient={'to-b'}
                gradientFrom={'brand.gold.300'}
                gradientTo={'brand.gold.500'}
                borderRadius={'10px'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                fontSize={'2xl'}
                boxShadow={'glow.blue'}
              >
                {'🎮'}
              </Box>
              <Text
                fontFamily={'heading'}
                fontSize={'2xl'}
                fontWeight={'bold'}
                bgGradient={'to-b'}
                gradientFrom={'brand.gold.300'}
                gradientTo={'brand.gold.500'}
                bgClip={'text'}
              >
                {t($ => $.COMMON.APP_NAME)}
              </Text>
            </Flex>
            <Text color={'text.secondary'} fontSize={'md'} maxW={'300px'}>
              {t($ => $.COMMON.FOOTER.BRAND.DESCRIPTION)}
            </Text>
          </Box>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <FooterSection key={index} title={section.title}>
              {section.links.map(link => (
                <FooterLink key={link.to} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterSection>
          ))}
        </Grid>

        {/* Footer Bottom */}
        <Flex
          pt={'8'}
          borderTop={'1px solid'}
          borderColor={'border.base'}
          justify={'space-between'}
          align={'center'}
          direction={{ base: 'column', md: 'row' }}
          gap={'4'}
        >
          <Text color={'text.muted'} fontSize={'sm'}>
            {t($ => $.COMMON.FOOTER.COPYRIGHT, { year: new Date().getFullYear() })}
          </Text>
          <HStack gap={'4'}>
            {socialLinks.map(link => (
              <SocialLink key={link.href} href={link.href} icon={link.icon} />
            ))}
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
