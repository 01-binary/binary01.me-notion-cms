import { GetStaticProps } from 'next';
import { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer } from 'react-notion-x';

import { getPage } from '@/utils';

import PageHead from '@/components/common/PageHead';

interface Props {
  recordMap: ExtendedRecordMap;
}

const AboutPage = ({ recordMap }: Props) => {
  return (
    <>
      <PageHead title="About" />
      <article>
        <NotionRenderer recordMap={recordMap} />
      </article>
    </>
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
    revalidate: 600,
  };
};
