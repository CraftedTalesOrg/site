import { config } from '@craftedtales/ui';
import { TamaguiProvider, Theme } from 'tamagui';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { ThemeContext, useThemeState } from '../hooks/useTheme';
import appCss from '../styles.css?url';
import type { JSX } from 'react';
import type { QueryClient } from '@tanstack/react-query';

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
        href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
      },
    ],
    scripts: [
      {
        // Prevent animation flash on load
        children: 'document.documentElement.classList.add(\'t_unmounted\')',
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }): JSX.Element {
  const themeState = useThemeState('dark');

  return (
    <html lang={'en'}>
      <head>
        <HeadContent />
      </head>
      <body>
        <TamaguiProvider config={config} defaultTheme={themeState.theme}>
          <ThemeContext value={themeState}>
            <Theme name={themeState.theme}>
              <Header />
              {children}
              <Footer />
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
            </Theme>
          </ThemeContext>
        </TamaguiProvider>
        <Scripts />
      </body>
    </html>
  );
}
