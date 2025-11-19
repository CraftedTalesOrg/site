import { config } from '@craftedtales/ui';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TamaguiProvider } from 'tamagui';
import Header from '../components/Header';
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
        <TamaguiProvider config={config} defaultTheme={'dark'}>
          <Header />
          {children}
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
            ]} />
        </TamaguiProvider>
        <Scripts />
      </body>
    </html>
  );
}
