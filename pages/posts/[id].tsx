import { ParsedUrlQuery } from 'querystring';

import { GetStaticPaths, GetStaticProps } from 'next';
import { ExtendedRecordMap, PageBlock } from 'notion-types';
import { getPageProperty, getPageTitle } from 'notion-utils';
import { defaultMapImageUrl } from 'react-notion-x';

import PostRenderer from '@/features/posts/Renderer';
import { getNotionPosts, getPage } from '@/utils';

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
  id: string;
}

export const getStaticProps: GetStaticProps<Props, PostParams> = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { id } = params!;
  const recordMap = await getPage(id);
  const previewImages = await getPreviewImageFromRecordMap(recordMap);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  const title = getPageTitle(recordMap);
  const description = getPageProperty<string>('Desc', block, recordMap);
  const keywords = getPageProperty<string>('Desc', block, recordMap);
  const ogImage = defaultMapImageUrl((block as PageBlock).format?.page_cover as string, block);

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
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (!process.env.NOTION_POST_DATABASE_ID)
    throw new Error('NOTION_POST_DATABASE_ID is not defined');
  const databaseItems = await getNotionPosts(process.env.NOTION_POST_DATABASE_ID);

  const paths = databaseItems.map(({ id }) => ({
    params: {
      id,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
