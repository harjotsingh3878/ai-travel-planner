import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/store/Provider';
import { Providers } from './providers';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Travel Planner - Smart Itineraries Powered by AI',
  description: 'Plan your perfect trip with AI-generated itineraries tailored to your budget, interests, and travel style.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script id="suppress-recharts-warning" strategy="beforeInteractive">
          {`
            const originalError = console.error;
            console.error = (...args) => {
              if (args[0]?.includes?.('style\` prop expects')) {
                return;
              }
              originalError(...args);
            };
          `}
        </Script>
        <Providers>
          <ReduxProvider>{children}</ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
