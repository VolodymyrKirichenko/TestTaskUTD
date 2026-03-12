import type {FC, ReactNode} from 'react';
import type {Metadata} from 'next';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'FullStack App',
  description: 'Next.js + Node.js monorepo',
};

const RootLayout: FC<{children: ReactNode}> = ({children}) => {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
