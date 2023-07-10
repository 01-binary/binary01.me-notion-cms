import React from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { siteConfig } from 'site.config';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string | null;
}

const PageHead = ({ title, description, image, keywords }: PageHeadProps) => {
  const { asPath } = useRouter();
  const pageTitle = title ? `${title} | ${siteConfig.blogName}` : siteConfig.blogName;
  const pageDescription = description || siteConfig.seoDefaultDesc;
  const pageKeywords = keywords || '';
  const pageImage = `${image || siteConfig.profileImg}`;
  const pageUrl = `${siteConfig.url}${asPath}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        name="google-site-verification"
        content="8ASKSU1Tj6Kc3H3qTnlRiVMn6F6PsLVsKU_RqsS0MfA"
      />
      <meta
        name="naver-site-verification"
        content="c5c5ff5b071ac345b5e4eda384975545289762d6"
      />
      <meta
        name="description"
        content={pageDescription}
      />
      <meta
        name="keywords"
        content={pageKeywords}
      />
      <meta
        name="author"
        content={siteConfig.author}
      />
      <link
        rel="canonical"
        href={pageUrl}
      />

      {/* og tags */}
      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:title"
        content={pageTitle}
      />
      <meta
        property="og:description"
        content={pageDescription}
      />
      <meta
        property="og:image"
        content={pageImage}
      />
      <meta
        property="og:image:alt"
        content={pageTitle}
      />
      <meta
        property="og:url"
        content={pageUrl}
      />
      <meta
        property="og:site_name"
        content={pageTitle}
      />

      {/* <meta
        property="og:image:width"
        content="1200"
      />
      <meta
        property="og:image:height"
        content="630"
      /> */}

      {/* twitter tags */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:site"
        content={siteConfig.author}
      />
      <meta
        name="twitter:creator"
        content={siteConfig.author}
      />
      <meta
        name="twitter:title"
        content={pageTitle}
      />
      <meta
        name="twitter:description"
        content={pageDescription}
      />
      <meta
        name="twitter:image"
        content={pageImage}
      />
      <meta
        name="twitter:image:alt"
        content={pageTitle}
      />
    </Head>
  );
};

export default PageHead;
