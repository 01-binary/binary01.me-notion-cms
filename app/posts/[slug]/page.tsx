import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { NotionBlock } from 'notion-to-jsx';
import { siteConfig } from 'site.config';

import { env } from '@/lib/env';
import {
  cachedFetchIdBySlug,
  cachedFetchNotionPageProperties,
  cachedFetchNotionPostsMeta,
  getSlugs,
  notionClient,
} from '@/utils';

import Giscus from './Giscus';
import PostRenderer from './PostRenderer';
import { extractPostMetadata, type PostSEOData } from './utils';

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

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      alternates: {
        canonical: `${siteConfig.url}/posts/${slug}`,
      },
      openGraph: {
        images: seo.coverUrl ? [{ url: seo.coverUrl }] : [],
        url: `${siteConfig.url}/posts/${slug}`,
      },
      twitter: {
        images: seo.coverUrl ? [seo.coverUrl] : [],
      },
    };
  } catch (error) {
    console.error(`Error fetching metadata for slug ${slug}:`, error);
    return {
      title: 'Not Found',
      description: 'This post could not be found.',
    };
  }
}

/**
 * 포스트 데이터를 병렬로 가져옵니다.
 */
async function fetchPostData(
  slug: string,
): Promise<{ blocks: NotionBlock[]; seo: PostSEOData } | null> {
  try {
    const id = await cachedFetchIdBySlug(slug, env.notionPostDatabaseId);

    const [blocks, properties] = await Promise.all([
      notionClient.getPageBlocks(id) as unknown as Promise<NotionBlock[]>,
      cachedFetchNotionPageProperties(id),
    ]);

    if (!blocks || blocks.length === 0) {
      return null;
    }

    return {
      blocks,
      seo: extractPostMetadata(properties, ''),
    };
  } catch (error) {
    console.error(`Error fetching post data for slug ${slug}:`, error);
    return null;
  }
}

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;

  const postData = await fetchPostData(slug);

  if (!postData) {
    notFound();
  }

  const { blocks, seo } = postData;

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
