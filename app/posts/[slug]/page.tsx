import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { NotionBlock } from 'notion-to-jsx';

import PostRenderer from '@/features/posts/PostRenderer';
import {
  cachedFetchIdBySlug,
  cachedFetchNotionPostsMeta,
  getSlugs,
  notionClient,
  cachedFetchNotionPageProperties,
} from '@/utils';
import { siteConfig } from 'site.config';

import Giscus from '@/components/common/Giscus';

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

    const title = properties?.['Name'] || 'Post';
    const description = properties?.['Desc'] || siteConfig.seoDefaultDesc;
    const coverUrl = properties?.['coverUrl'] || '';
    const keywords = properties?.['Category']?.['name'] || '';
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

  if (!process.env.NOTION_POST_DATABASE_ID) {
    console.error('NOTION_POST_DATABASE_ID is not defined for PostPage');
    return <div>Configuration error: NOTION_POST_DATABASE_ID is not set.</div>;
  }

  let id, blocks, seo;
  try {
    id = await cachedFetchIdBySlug(slug, process.env.NOTION_POST_DATABASE_ID);
    const notionBlocks = (await notionClient.getPageBlocks(id)) as NotionBlock[];
    const properties = await cachedFetchNotionPageProperties(id);
    blocks = notionBlocks;
    seo = {
      title: properties?.['Name'] || '',
      description: properties?.['Desc'] || '',
      keywords: properties?.['Category']?.['name'] || '',
      coverUrl: properties?.['coverUrl'] || '',
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
