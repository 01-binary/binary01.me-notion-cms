import React from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { DEFAULT_AUTHOR, DEFAULT_IMAGE, DEFAULT_TITLE, DEFAULT_URL } from '@/assets/constants';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string | null;
}

const PageHead = ({ title, description, image, keywords }: PageHeadProps) => {
  const { asPath } = useRouter();

  const pageTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const pageDescription = description || '';
  const pageKeywords = keywords || '';
  const pageImage = `${image || DEFAULT_IMAGE}`;
  const pageUrl = `${process.env.SITE_URL || DEFAULT_URL}${asPath}`;

  return (
    <Head>
      <title>{pageTitle}</title>
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
        content={DEFAULT_AUTHOR}
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

      <meta
        property="og:image:width"
        content="1200"
      />
      <meta
        property="og:image:height"
        content="630"
      />

      {/* twitter tags */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
      <meta
        name="twitter:site"
        content={DEFAULT_AUTHOR}
      />
      <meta
        name="twitter:creator"
        content={DEFAULT_AUTHOR}
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