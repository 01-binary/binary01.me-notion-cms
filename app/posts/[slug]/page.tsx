import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import type { NotionBlock } from 'notion-to-utils';
import { cache } from 'react';
import { siteConfig } from 'site.config';

import { env } from '@/lib/env';
import { buildSocialMetadata } from '@/utils/buildSocialMetadata';
import { getCachedPostsMeta } from '@/utils/fetchNotionPostsMeta';
import notionClient from '@/utils/notionClient';

import Giscus from './_components/Giscus';
import PostRenderer from './_components/PostRenderer';
import {
  extractPostMetadata,
  getCachedIdBySlug,
  getCachedPageProperties,
  type PostSEOData,
} from './_utils';

type FetchPostDataResult =
  | { status: 'success'; blocks: NotionBlock[]; seo: PostSEOData }
  | { status: 'not_found' };

/**
 * 포스트 데이터를 병렬로 가져옵니다.
 *
 * 일시적인 실패(429, 네트워크 오류 등)는 잡지 않고 그대로 던집니다.
 * 'use cache' 안에서 잡아 not_found로 바꾸면 실패한 결과가 daysForever로 캐시되어
 * 멀쩡한 글이 하루 동안 404로 서빙되기 때문입니다.
 *
 * @returns Discriminated union으로 success/not_found 상태를 구분합니다.
 */
async function fetchPostData(slug: string): Promise<FetchPostDataResult> {
  'use cache';
  cacheTag('post', slug);
  cacheLife('daysForever');

  const id = await getCachedIdBySlug(slug, env.notionPostDatabaseId);

  if (!id) {
    return { status: 'not_found' };
  }

  const [blocks, properties] = await Promise.all([
    notionClient.getPageBlocks(id),
    getCachedPageProperties(id),
  ]);

  // notion-to-utils는 블록 조회 실패를 빈 배열로 돌려주므로, 비어 있으면 실패로 간주합니다
  if (blocks.length === 0) {
    throw new Error(`Failed to fetch blocks for post "${slug}" (page ${id})`);
  }

  return {
    status: 'success',
    blocks,
    seo: extractPostMetadata(properties),
  };
}

// generateMetadata와 페이지 렌더가 같은 요청 안에서 결과를 공유하도록 하는 React.cache 래퍼
const getPostData = cache(fetchPostData);

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getCachedPostsMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostData(slug);

  if (result.status !== 'success') {
    return {
      title: 'Not Found',
      description: 'This post could not be found.',
    };
  }

  const { seo } = result;
  const pageUrl = `${siteConfig.url}/posts/${slug}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: pageUrl },
    ...buildSocialMetadata({ imageUrl: seo.coverUrl, pageUrl }),
  };
}

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;

  const result = await getPostData(slug);

  if (result.status !== 'success') {
    notFound();
  }

  const { blocks, seo } = result;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: seo.title,
    description: seo.description,
    author: { '@type': 'Person', name: siteConfig.author, url: siteConfig.url },
    url: `${siteConfig.url}/posts/${slug}`,
    ...(seo.published && { datePublished: `${seo.published}T00:00:00+09:00` }),
    ...(seo.coverUrl && { image: seo.coverUrl }),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostRenderer
        blocks={blocks}
        title={seo.title}
        cover={seo.coverUrl}
      />
      <div className="mx-auto max-w-[900px] px-4">
        <Giscus />
      </div>
    </article>
  );
};

export default PostPage;
