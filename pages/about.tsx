import { GetStaticProps } from 'next';
import { NotionRenderer } from 'react-notion-x';

import { ExtendedRecordMap as EmbeddedRecordMap } from '@/interfaces/notion';
import { getPage } from '@/utils';

import PageHead from '@/components/common/PageHead';

import { REVALIDATE_TIME } from '@/assets/constants';

interface Props {
  recordMap: EmbeddedRecordMap;
}

const AboutPage = ({ recordMap }: Props) => {
  return (
    <>
      <PageHead title="About" />
      <article>
        <NotionRenderer
          recordMap={recordMap as Parameters<typeof NotionRenderer>[0]['recordMap']}
        />
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
    revalidate: REVALIDATE_TIME,
  };
};
