import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { NotionBlock } from 'notion-to-jsx';
import { siteConfig } from 'site.config';

import { env } from '@/lib/env';
import { buildSocialMetadata } from '@/utils/buildSocialMetadata';
import { cachedFetchNotionPostsMeta } from '@/utils/fetchNotionPostsMeta';
import notionClient from '@/utils/notionClient';

import Giscus from './_components/Giscus';
import PostRenderer from './_components/PostRenderer';
import {
  cachedFetchIdBySlug,
  cachedFetchNotionPageProperties,
  extractPostMetadata,
  getSlugs,
  type PostSEOData,
} from './_utils';

// 페이지 단위 revalidation 설정 (Next.js 16: 리터럴 값만 허용)
export const revalidate = 300; // 5 minutes

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// 빌드 시점에 정적 경로 생성
export async function generateStaticParams() {
  const databaseItems = await cachedFetchNotionPostsMeta(env.notionPostDatabaseId);
  const slugs = getSlugs(databaseItems);

  return slugs.map((slug) => ({ slug }));
}

// 페이지 메타데이터 동적 생성
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const id = await cachedFetchIdBySlug(slug, env.notionPostDatabaseId);
    const properties = await cachedFetchNotionPageProperties(id);
    const seo = extractPostMetadata(properties);
    const pageUrl = `${siteConfig.url}/posts/${slug}`;

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      alternates: { canonical: pageUrl },
      ...buildSocialMetadata({ imageUrl: seo.coverUrl, pageUrl }),
    };
  } catch (error) {
    console.error(`Error fetching metadata for slug ${slug}:`, error);
    return {
      title: 'Not Found',
      description: 'This post could not be found.',
    };
  }
}

type FetchPostDataResult =
  | { status: 'success'; blocks: NotionBlock[]; seo: PostSEOData }
  | { status: 'not_found' }
  | { status: 'error'; message: string };

/**
 * 포스트 데이터를 병렬로 가져옵니다.
 *
 * @returns Discriminated union으로 success/not_found/error 상태를 구분합니다.
 */
async function fetchPostData(slug: string): Promise<FetchPostDataResult> {
  try {
    const id = await cachedFetchIdBySlug(slug, env.notionPostDatabaseId);

    const [blocks, properties] = await Promise.all([
      notionClient.getPageBlocks(id) as unknown as Promise<NotionBlock[]>,
      cachedFetchNotionPageProperties(id),
    ]);

    if (!blocks || blocks.length === 0) {
      return { status: 'not_found' };
    }

    return {
      status: 'success',
      blocks,
      seo: extractPostMetadata(properties, ''),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error fetching post data for slug ${slug}:`, error);
    return { status: 'error', message };
  }
}

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;

  const result = await fetchPostData(slug);

  if (result.status !== 'success') {
    notFound();
  }

  const { blocks, seo } = result;

  return (
    <article>
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
