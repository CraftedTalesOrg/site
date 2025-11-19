import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { JSX } from 'react';

interface QueryContext { queryClient: QueryClient }

export function getContext(): QueryContext {
  const queryClient = new QueryClient();

  return { queryClient };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
