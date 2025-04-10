import { ParsedUrlQuery } from 'querystring';

import { GetStaticPaths, GetStaticProps } from 'next';
import { NotionBlock, Renderer } from 'notion-to-jsx';

import { getIdBySlug, getNotionPosts, getSlugs, notionClient } from '@/utils';

import Giscus from '@/components/common/Giscus';
import PageHead from '@/components/common/PageHead';

import { REVALIDATE_TIME } from '@/assets/constants';

interface Props {
  blocks: NotionBlock[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    coverUrl: string;
  };
}

const PostPage = ({ blocks, seo: { title, description, keywords, coverUrl } }: Props) => {
  if (!blocks) return null;
  return (
    <>
      <PageHead
        title={title}
        description={description}
        keywords={keywords}
        image={coverUrl}
      />
      <Renderer
        title={title}
        cover={coverUrl}
        blocks={blocks}
      />
      <div className="mx-auto max-w-[900px] px-4">
        <Giscus />
      </div>
    </>
  );
};

export default PostPage;

interface PostParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<Props, PostParams> = async ({ params }) => {
  const { slug } = params as PostParams;
  const id = await getIdBySlug(slug as string, process.env.NOTION_POST_DATABASE_ID as string);
  const blocks = (await notionClient.getPageBlocks(id)) as NotionBlock[];
  const properties = await notionClient.getPageProperties(id);

  return {
    props: {
      blocks,
      seo: {
        title: properties?.['Name'] || '',
        description: properties?.['Desc'] || '',
        keywords: properties?.['Category']?.['name'] || '',
        coverUrl: properties?.['coverUrl'] || '',
      },
    },
    revalidate: REVALIDATE_TIME,
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
