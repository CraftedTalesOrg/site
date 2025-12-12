import { system } from '@/theming';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import type { JSX } from 'react';
import { I18nextProvider } from 'react-i18next';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Toaster } from '../components/Toaster';
import i18n from '../i18n/config';
import appCss from '../styles.css?url';

interface MyRouterContext { queryClient: QueryClient }

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'CraftedTales' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap',
      },
    ],
    scripts: [
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang={'en'}>
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          <ChakraProvider value={system}>
            <Header />
            {children}
            <Footer />
            <Toaster />
            <TanStackDevtools
              config={{ position: 'bottom-right' }}
              plugins={[
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                {
                  name: 'Tanstack Query',
                  render: <ReactQueryDevtools />,
                },
              ]}
            />
          </ChakraProvider>
        </I18nextProvider>
        <Scripts />
      </body>
    </html>
  );
}
