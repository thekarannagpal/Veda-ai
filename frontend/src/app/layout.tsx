import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedaAI Assessment Creator',
  description: 'AI-generated assignment creator based on Figma designs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F4F5F7] text-gray-900`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-4 sm:p-8 lg:p-12 overflow-y-auto min-h-screen">
            <div className="max-w-[900px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
