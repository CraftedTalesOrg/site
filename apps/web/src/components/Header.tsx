import type { JSX } from 'react';
import { Box, Flex, HStack, Menu, Portal } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/theming/components';
import { Menu as MenuIcon } from 'lucide-react';
import { toaster } from './Toaster';

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
          <Box
            fontFamily={'heading'}
            fontSize={'2xl'}
            fontWeight={'bold'}
            bgGradient={'to-b'}
            gradientFrom={'brand.gold.300'}
            gradientTo={'brand.gold.500'}
            bgClip={'text'}
            display={{ base: 'none', sm: 'block' }}
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
            onClick={(e) => {
              e.preventDefault();
              toaster.error({
                title: 'Coming Soon',
                description: 'This page is under construction.',
                duration: 3000,
              });
            }}
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
            onClick={(e) => {
              e.preventDefault();
              toaster.error({
                title: 'Coming Soon',
                description: 'This page is under construction.',
                duration: 3000,
              });
            }}
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
        </HStack>

        {/* CTA Buttons */}
        <HStack gap={'4'} display={{ base: 'none', lg: 'flex' }}>
          <Button
            variant={'outline'}
            size={'sm'}
            onClick={() => {
              toaster.error({
                title: 'Coming Soon',
                description: 'This page is under construction.',
                duration: 3000,
              });
            }}
          >
            {t($ => $.COMMON.HEADER.CTA.SIGN_IN)}
          </Button>
          <Button
            variant={'gradient'}
            size={'sm'}
            onClick={() => {
              toaster.error({
                title: 'Coming Soon',
                description: 'This page is under construction.',
                duration: 3000,
              });
            }}
          >
            {t($ => $.COMMON.HEADER.CTA.GET_STARTED)}
          </Button>
        </HStack>

        {/* Mobile Menu Button */}
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant={'transparent'} display={{ base: 'flex', lg: 'none' }} size={'sm'}>
              <MenuIcon />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content minW={'200px'}>
                <Menu.ItemGroup>
                  <Menu.Item value={'mods'} asChild>
                    <Link
                      to={'/mods'}
                      onClick={(e) => {
                        e.preventDefault();
                        toaster.error({
                          title: 'Coming Soon',
                          description: 'This page is under construction.',
                          duration: 3000,
                        });
                      }}
                    >
                      {t($ => $.COMMON.HEADER.NAV.MODS)}
                    </Link>
                  </Menu.Item>
                  <Menu.Item value={'categories'} asChild>
                    <Link
                      to={'/categories'}
                      onClick={(e) => {
                        e.preventDefault();
                        toaster.error({
                          title: 'Coming Soon',
                          description: 'This page is under construction.',
                          duration: 3000,
                        });
                      }}
                    >
                      {t($ => $.COMMON.HEADER.NAV.CATEGORIES)}
                    </Link>
                  </Menu.Item>
                  <Menu.Item value={'creators'} asChild>
                    <Link
                      to={'/creators'}
                      onClick={(e) => {
                        e.preventDefault();
                        toaster.error({
                          title: 'Coming Soon',
                          description: 'This page is under construction.',
                          duration: 3000,
                        });
                      }}
                    >
                      {t($ => $.COMMON.HEADER.NAV.CREATORS)}
                    </Link>
                  </Menu.Item>
                </Menu.ItemGroup>
                <Menu.Separator />
                <Menu.ItemGroup>
                  <Menu.Item value={'login'} asChild>
                    <Link
                      to={'/login'}
                      onClick={(e) => {
                        e.preventDefault();
                        toaster.error({
                          title: 'Coming Soon',
                          description: 'This page is under construction.',
                          duration: 3000,
                        });
                      }}
                    >
                      {t($ => $.COMMON.HEADER.CTA.SIGN_IN)}
                    </Link>
                  </Menu.Item>
                  <Menu.Item value={'register'} asChild>
                    <Link
                      to={'/register'}
                      onClick={(e) => {
                        e.preventDefault();
                        toaster.error({
                          title: 'Coming Soon',
                          description: 'This page is under construction.',
                          duration: 3000,
                        });
                      }}
                    >
                      {t($ => $.COMMON.HEADER.CTA.GET_STARTED)}
                    </Link>
                  </Menu.Item>
                </Menu.ItemGroup>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Box>
  );
}
