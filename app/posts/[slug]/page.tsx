import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { NotionBlock } from 'notion-to-jsx';
import { siteConfig } from 'site.config';

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
  if (!process.env.NOTION_POST_DATABASE_ID) {
    console.error('NOTION_POST_DATABASE_ID is not defined for generateStaticParams');
    return [];
  }
  const databaseItems = await cachedFetchNotionPostsMeta(process.env.NOTION_POST_DATABASE_ID);
  const slugs = getSlugs(databaseItems);

  return slugs.map((slug) => ({ slug }));
}

// 페이지 메타데이터 동적 생성
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!process.env.NOTION_POST_DATABASE_ID) {
    console.error('NOTION_POST_DATABASE_ID is not defined for generateMetadata');
    return { title: 'Error', description: 'Configuration error.' };
  }

  try {
    const id = await cachedFetchIdBySlug(slug, process.env.NOTION_POST_DATABASE_ID);
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
 * 포스트 데이터를 가져옵니다.
 * 타입 안전성과 에러 처리를 위해 별도 함수로 분리합니다.
 */
async function fetchPostData(
  slug: string,
  databaseId: string,
): Promise<{ blocks: NotionBlock[]; seo: PostSEOData } | null> {
  try {
    const id = await cachedFetchIdBySlug(slug, databaseId);
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

  if (!process.env.NOTION_POST_DATABASE_ID) {
    console.error('NOTION_POST_DATABASE_ID is not defined for PostPage');
    return <div>Configuration error: NOTION_POST_DATABASE_ID is not set.</div>;
  }

  const postData = await fetchPostData(slug, process.env.NOTION_POST_DATABASE_ID);

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
