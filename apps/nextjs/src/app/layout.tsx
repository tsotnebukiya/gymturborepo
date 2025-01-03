import type { Metadata } from 'next';

import './globals.css';
import Footer from '~/components/Footer';
import Header from '~/components/Header';

export const metadata: Metadata = {
  title: 'Smart Gym Assistant | GymLead AI',
  description:
    'Discover exercises for any gym equipment, get detailed instructions, and create personalized workout plans with AI assistance.',
  keywords: [
    'gym assistant',
    'workout plans',
    'exercise instructions',
    'AI fitness',
    'gym equipment',
    'personal training',
    'workout guidance',
    'fitness planning',
  ],
  openGraph: {
    title: 'Smart Gym Assistant | GymLead AI',
    description:
      'Discover exercises for any gym equipment, get detailed instructions, and create personalized workout plans with AI assistance.',
    url: 'https://gymleadai.app/',
    siteName: 'Smart Gym Assistant',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="flex flex-col min-h-screen ">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
