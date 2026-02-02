// 전역 스타일 - 순서 중요: 외부 라이브러리 먼저, Tailwind는 마지막
import 'notion-to-jsx/dist/index.css';
import 'prismjs/themes/prism-tomorrow.css';
import '@/assets/styles/index.css';

import type { Metadata } from 'next';
import { type ReactNode } from 'react';
import { siteConfig } from 'site.config';

import SiteLayout from './_components/layout';
import JotaiProvider from './_providers/JotaiProvider';
import ThemeProvider from './_providers/ThemeProvider';

// FOUC 방지를 위한 인라인 스크립트
const themeInitScript = `
  (function() {
    try {
      const stored = localStorage.getItem('theme');
      const theme = stored ? JSON.parse(stored) : 'system';
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = theme === 'dark' || (theme === 'system' && systemDark);
      if (isDark) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export const metadata: Metadata = {
  title: {
    default: siteConfig.homeTitle,
    template: `%s | ${siteConfig.blogName}`,
  },
  authors: [{ name: siteConfig.author }],
  description: siteConfig.seoDefaultDesc,
  icons: {
    apple: '/apple-icon-180x180.png',
  },
  alternates: {
    canonical: `${siteConfig.url}`,
  },
  verification: {
    google: siteConfig.googleSiteVerification,
    other: {
      'naver-site-verification': siteConfig.naverSiteVerification,
    },
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: `${siteConfig.blogName} | ${siteConfig.homeTitle}`,
    description: siteConfig.seoDefaultDesc,
    url: siteConfig.url,
    siteName: siteConfig.blogName,
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.homeTitle,
    creator: siteConfig.author,
    description: siteConfig.seoDefaultDesc,
    site: siteConfig.blogName,
  },
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <JotaiProvider>
          <ThemeProvider>
            <SiteLayout>{children}</SiteLayout>
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  );
};

export default RootLayout;
