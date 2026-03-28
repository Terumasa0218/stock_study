import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'StockLens',
  description: '株式投資学習・分析プラットフォーム'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
