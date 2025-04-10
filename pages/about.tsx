import { GetStaticProps } from 'next';
import { NotionBlock, Renderer } from 'notion-to-jsx';

import { notionClient } from '@/utils';

import PageHead from '@/components/common/PageHead';

import { REVALIDATE_TIME } from '@/assets/constants';

interface Props {
  blocks: NotionBlock[];
}

const AboutPage = ({ blocks }: Props) => {
  return (
    <>
      <PageHead title="About" />
      <Renderer blocks={blocks} />
    </>
  );
};

export default AboutPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const aboutId = process.env.NOTION_ABOUT_ID;

  if (!aboutId) throw new Error('NOTION_ABOUT_ID is not defined');

  const blocks = (await notionClient.getPageBlocks(aboutId)) as NotionBlock[];
  return {
    props: {
      blocks,
    },
    revalidate: REVALIDATE_TIME,
  };
};
