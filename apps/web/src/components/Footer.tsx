import type { JSX } from 'react';
import { Box, Flex, Grid, HStack } from '@chakra-ui/react';
import { Link } from '@/theming/components';
import { useTranslation } from 'react-i18next';
import { Text } from '@/theming/components';
import { siDiscord, siGithub } from 'simple-icons';
import { toaster } from './Toaster';

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

function FooterLink({ to, children }: FooterLinkProps): JSX.Element {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    toaster.error({
      title: 'Coming Soon',
      description: 'This page is under construction.',
      duration: 3000,
    });
  };

  return (
    <Link to={to} onClick={handleClick}>
      {children}
    </Link>
  );
}

interface SocialLinkProps {
  href: string;
  icon: JSX.Element;
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
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--chakra-colors-brand-blue-500)';
        e.currentTarget.style.color = 'var(--chakra-colors-brand-blue-500)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--chakra-colors-border-base)';
        e.currentTarget.style.color = 'var(--chakra-colors-text-secondary)';
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
      <Text variant={'footerSectionTitle'} mb={'6'}>
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
        { to: '/news', label: t($ => $.COMMON.FOOTER.SECTIONS.COMMUNITY.NEWS) },
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
    {
      href: 'https://discord.gg/Rkm2tF4GWM',
      icon: (
        <svg
          role={'img'}
          viewBox={'0 0 24 24'}
          width={'20'}
          height={'20'}
          fill={'currentColor'}
        >
          <path d={siDiscord.path} />
        </svg>
      ),
    },
    {
      href: 'https://github.com/CraftedTalesOrg',
      icon: (
        <svg
          role={'img'}
          viewBox={'0 0 24 24'}
          width={'20'}
          height={'20'}
          fill={'currentColor'}
        >
          <path d={siGithub.path} />
        </svg>
      ),
    },
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
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: '2fr 1fr 1fr 1fr' }}
          gap={'16'}
          mb={'12'}
          textAlign={{ base: 'center', lg: 'left' }}
          justifyItems={{ base: 'center', lg: 'start' }}
        >
          {/* Brand Section */}
          <Box>
            <Flex align={'center'} justify={{ base: 'center', lg: 'start' }} gap={'3'} mb={'4'}>
              <Box
                bgGradient={'to-b'}
                gradientFrom={'brand.gold.300'}
                gradientTo={'brand.gold.500'}
                borderRadius={'10px'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                fontSize={{ base: 'lg', md: '2xl' }}
                boxShadow={'glow.blue'}
              >
                {'🎮'}
              </Box>
              <Text
                variant={'brandLogo'}
                bgGradient={'to-b'}
                gradientFrom={'brand.gold.300'}
                gradientTo={'brand.gold.500'}
                bgClip={'text'}
              >
                {t($ => $.COMMON.APP_NAME)}
              </Text>
            </Flex>
            <Text variant={'cardBody'} maxW={'300px'}>
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
          <Text variant={'caption'}>
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
