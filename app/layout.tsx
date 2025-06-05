import { ReactNode } from 'react';

import type { Metadata } from 'next';

import { siteConfig } from 'site.config';

import SiteLayout from '@/components/layout';

// Global Styles
import 'notion-to-jsx/dist/index.css';
import '@/assets/styles/index.css';
import 'prismjs/themes/prism-tomorrow.css';

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
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
};

export default RootLayout;
