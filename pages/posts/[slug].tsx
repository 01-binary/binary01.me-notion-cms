import { ParsedUrlQuery } from 'querystring';

import { GetStaticPaths, GetStaticProps } from 'next';
import { ExtendedRecordMap } from 'notion-types';
import { getPageTitle } from 'notion-utils';

import PostRenderer from '@/features/posts/Renderer';
import { getIdBySlug, getNotionPosts, getPage, getPageProperties, getSlugs } from '@/utils';
import { siteConfig } from 'site.config';

import PageHead from '@/components/common/PageHead';

import { getPreviewImageFromRecordMap } from '@/utils/previewImage';

interface Props {
  recordMap: ExtendedRecordMap;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string | null;
  };
}

const PostPage = ({ recordMap, seo: { title, description, keywords, ogImage } }: Props) => {
  if (!recordMap) return null;
  return (
    <>
      <PageHead
        title={title}
        description={description}
        keywords={keywords}
        image={ogImage}
      />
      <article>
        <PostRenderer recordMap={recordMap} />
      </article>
    </>
  );
};

export default PostPage;

interface PostParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<Props, PostParams> = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { slug } = params!;
  const id = await getIdBySlug(slug as string, process.env.NOTION_POST_DATABASE_ID as string);
  const recordMap = await getPage(id);
  const { description, keywords } = await getPageProperties(id);
  const previewImages = await getPreviewImageFromRecordMap(recordMap);

  const title = getPageTitle(recordMap);
  const ogImage = `${siteConfig.url}/api/coverImage?pageId=${id}`;

  return {
    props: {
      recordMap: {
        ...recordMap,
        preview_images: previewImages,
      } as ExtendedRecordMap,
      seo: {
        title,
        description,
        keywords,
        ogImage,
      },
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');
  const databaseItems = await getNotionPosts(process.env.NOTION_POST_DATABASE_ID);
  const slugs = getSlugs(databaseItems);

  const paths = slugs.map((slug) => ({
    params: {
      slug,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
