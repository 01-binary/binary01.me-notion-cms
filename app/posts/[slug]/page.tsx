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

    const title = (properties?.['Name'] as string) || 'Post';
    const description = (properties?.['Desc'] as string) || siteConfig.seoDefaultDesc;
    const coverUrl = (properties?.['coverUrl'] as string) || '';
    const category = properties?.['Category'] as { name?: string } | undefined;
    const keywords = category?.name || '';
    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: `${siteConfig.url}/posts/${slug}`,
      },
      openGraph: {
        images: coverUrl ? [{ url: coverUrl }] : [],
        url: `${siteConfig.url}/posts/${slug}`,
      },
      twitter: {
        images: coverUrl ? [coverUrl] : [],
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

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;

  let id, blocks, seo;
  try {
    id = await cachedFetchIdBySlug(slug, env.notionPostDatabaseId);
    // 병렬 실행으로 waterfall 제거
    const [notionBlocks, properties] = await Promise.all([
      notionClient.getPageBlocks(id) as unknown as Promise<NotionBlock[]>,
      cachedFetchNotionPageProperties(id),
    ]);
    blocks = notionBlocks;
    const category = properties?.['Category'] as { name?: string } | undefined;
    seo = {
      title: (properties?.['Name'] as string) || '',
      description: (properties?.['Desc'] as string) || '',
      keywords: category?.name || '',
      coverUrl: (properties?.['coverUrl'] as string) || '',
    };

    if (!blocks || blocks.length === 0) {
      notFound();
    }
  } catch (error) {
    console.error(`Error fetching post data for slug ${slug}:`, error);
    notFound();
  }

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
