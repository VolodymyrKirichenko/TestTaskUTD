import type {FC, ReactNode} from 'react';
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'App',
  description: 'Next.js + Node.js monorepo',
};

const RootLayout: FC<{children: ReactNode}> = ({children}) => {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
