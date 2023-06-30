import { ParsedUrlQuery } from 'querystring';

import { GetStaticPaths, GetStaticProps } from 'next';
import { ExtendedRecordMap } from 'notion-types';

import PostRenderer from '@/features/posts/Renderer';
import { getNotionPosts, getPage } from '@/utils';

import { getPreviewImageFromRecordMap } from '@/utils/previewImage';

interface Props {
  recordMap: ExtendedRecordMap;
}

const PostPage = ({ recordMap }: Props) => {
  if (!recordMap) return null;
  return (
    <article>
      <PostRenderer recordMap={recordMap} />
    </article>
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

  return {
    props: {
      recordMap: {
        ...recordMap,
        preview_images: previewImages,
      } as ExtendedRecordMap,
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
