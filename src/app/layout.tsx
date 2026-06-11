import type { Metadata } from 'next';
import './globals.css';
import Analytics from '@/components/Analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.openai2025.com'),
  title: {
    default: '传道AI - 在线工具箱',
    template: '%s | 传道AI',
  },
  description: '传道AI提供丰富的在线工具，包括生活工具、图片处理、加密解密、编码解码、开发工具等多个分类，帮助您更高效地完成日常工作。',
  keywords: ['在线工具', '工具箱', '生活工具', '图片处理', '加密解密', '编码解码', '开发工具', '实用工具'],
  authors: [{ name: '传道AI' }],
  creator: '传道AI',
  publisher: '传道AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head></head>
      <body className="antialiased min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
