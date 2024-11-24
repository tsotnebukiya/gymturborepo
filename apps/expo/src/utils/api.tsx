import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import type { AppRouter } from '@acme/api';
import { useAuth } from '@clerk/clerk-expo';

const getBaseUrl = () => {
  // if (process.env.ENVIRONMENT === 'development') {
  //   return `http://localhost:3000`;
  // }
  // return process.env.EXPO_PUBLIC_API_ORIGIN;
  return 'http://localhost:3000';
};

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from '@acme/api';

export function TRPCProvider(props: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { gcTime: 1000 * 60 * 30 } },
      })
  );
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          // enabled: (opts) =>
          //   process.env.NODE_ENV === 'development' ||
          //   (opts.direction === 'down' && opts.result instanceof Error),
          enabled: () => false,
          colorMode: 'ansi',
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
          async headers() {
            const token = await getToken();
            const headers = new Map<string, string>();
            headers.set('x-trpc-source', 'expo-react');
            if (token) headers.set('Authorization', `Bearer ${token}`);

            return Object.fromEntries(headers);
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}
