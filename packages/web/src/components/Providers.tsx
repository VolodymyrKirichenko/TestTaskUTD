'use client';

import {type FC, type ReactNode, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Header from '@/components/Header';

interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({children}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 5 * 60_000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
