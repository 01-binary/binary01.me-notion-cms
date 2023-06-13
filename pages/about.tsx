import { GetStaticProps } from 'next';
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';

import { getPage } from '@/utils';

interface Props {
  recordMap: ExtendedRecordMap | null;
}

const AboutPage = ({ recordMap }: Props) => {
  if (!recordMap) return null;

  return (
    <article>
      <NotionRenderer recordMap={recordMap} />
    </article>
  );
};

export default AboutPage;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const aboutId = process.env.NOTION_ABOUT_ID;

  if (!aboutId) throw new Error('NOTION_ABOUT_ID is not defined');

  const recordMap = await getPage(aboutId);

  return {
    props: {
      recordMap,
    },
    revalidate: 300,
  };
};
