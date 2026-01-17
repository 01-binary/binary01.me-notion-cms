// Global Styles - order matters: external first, then Tailwind
import 'notion-to-jsx/dist/index.css';
import 'prismjs/themes/prism-tomorrow.css';
import '@/assets/styles/index.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { siteConfig } from 'site.config';

import SiteLayout from '@/components/layout';
import JotaiProvider from '@/providers/JotaiProvider';

export const metadata: Metadata = {
  title: {
    default: siteConfig.homeTitle,
    template: `%s | ${siteConfig.blogName}`,
  },
  authors: [{ name: siteConfig.author }],
  description: siteConfig.seoDefaultDesc,
  alternates: {
    canonical: `${siteConfig.url}`,
  },
  verification: {
    google: siteConfig.googleSiteVerification,
    other: {
      'naver-site-verification': siteConfig.naverSiteVerification,
    },
  },
  metadataBase: new URL(siteConfig.url), // 상대 경로 OG 이미지를 위해 기본 URL 설정
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
    <html lang="ko">
      <body>
        <JotaiProvider>
          <SiteLayout>{children}</SiteLayout>
        </JotaiProvider>
      </body>
    </html>
  );
};

export default RootLayout;
