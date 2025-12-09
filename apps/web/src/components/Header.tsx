import type { JSX } from 'react';
import { Box, Flex, HStack, Button } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export default function Header(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Box
      as={'header'}
      position={'fixed'}
      top={'0'}
      left={'0'}
      right={'0'}
      zIndex={1000}
      px={'8'}
      py={'4'}
      bg={'rgba(10, 10, 15, 0.85)'}
      backdropFilter={'blur(20px)'}
      borderBottom={'1px solid'}
      borderColor={'border.base'}
    >
      <Flex
        maxW={'1400px'}
        mx={'auto'}
        justify={'space-between'}
        align={'center'}
      >
        {/* Logo */}
        <Link
          to={'/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <Box
            w={'42px'}
            h={'42px'}
            bgGradient={'to-br'}
            gradientFrom={'brand.cyan.500'}
            gradientTo={'brand.purple.500'}
            borderRadius={'10px'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            fontSize={'2xl'}
            boxShadow={'glow.cyan'}
          >
            {'🎮'}
          </Box>
          <Box
            fontFamily={'heading'}
            fontSize={'2xl'}
            fontWeight={'bold'}
            bgGradient={'to-br'}
            gradientFrom={'brand.cyan.500'}
            gradientTo={'brand.purple.500'}
            bgClip={'text'}
          >
            {t($ => $.COMMON.APP_NAME)}
          </Box>
        </Link>

        {/* Navigation Links */}
        <HStack gap={'10'} display={{ base: 'none', lg: 'flex' }}>
          <Link
            to={'/mods'}
            style={{
              color: 'var(--chakra-colors-text-secondary)',
              fontWeight: '500',
              fontSize: '0.95rem',
              position: 'relative',
              textDecoration: 'none',
            }}
          >
            {t($ => $.COMMON.HEADER.NAV.MODS)}
          </Link>
          <Link
            to={'/categories'}
            style={{
              color: 'var(--chakra-colors-text-secondary)',
              fontWeight: '500',
              fontSize: '0.95rem',
              position: 'relative',
              textDecoration: 'none',
            }}
          >
            {t($ => $.COMMON.HEADER.NAV.CATEGORIES)}
          </Link>
          <Link
            to={'/creators'}
            style={{
              color: 'var(--chakra-colors-text-secondary)',
              fontWeight: '500',
              fontSize: '0.95rem',
              position: 'relative',
              textDecoration: 'none',
            }}
          >
            {t($ => $.COMMON.HEADER.NAV.CREATORS)}
          </Link>
          <Link
            to={'/about'}
            style={{
              color: 'var(--chakra-colors-text-secondary)',
              fontWeight: '500',
              fontSize: '0.95rem',
              position: 'relative',
              textDecoration: 'none',
            }}
          >
            {t($ => $.COMMON.HEADER.NAV.ABOUT)}
          </Link>
        </HStack>

        {/* CTA Buttons */}
        <HStack gap={'4'} display={{ base: 'none', md: 'flex' }}>
          <Button
            asChild
            variant={'outline'}
            borderColor={'border.base'}
            color={'text.primary'}
          >
            <Link to={'/login'}>{t($ => $.COMMON.HEADER.CTA.SIGN_IN)}</Link>
          </Button>
          <Button
            asChild
            bgGradient={'to-br'}
            gradientFrom={'brand.cyan.500'}
            gradientTo={'brand.purple.500'}
            color={'text.primary'}
            boxShadow={'glow.cyan'}
          >
            <Link to={'/register'}>{t($ => $.COMMON.HEADER.CTA.GET_STARTED)}</Link>
          </Button>
        </HStack>

        {/* Mobile Menu Button */}
        <Button
          display={{ base: 'flex', md: 'none' }}
          variant={'ghost'}
          fontSize={'xl'}
        >
          {'☰'}
        </Button>
      </Flex>
    </Box>
  );
}
