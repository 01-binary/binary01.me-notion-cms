import React from 'react';

import { MultiSelectPropertyItemObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { GetStaticProps } from 'next';

import { getNotionDBItems, getTags } from '@/utils';

import TagsContainer from '@/components/tag/TagsContainer';
import TagsIntro from '@/components/tag/TagsIntro';

interface TagsIndexPageProps {
  tags: MultiSelectPropertyItemObjectResponse['multi_select'];
}

const TagsIndexPage = ({ tags }: TagsIndexPageProps) => {
  return (
    <div className="h-[calc(100vh-72px-88px)]">
      <TagsIntro />
      <TagsContainer tags={tags} />
    </div>
  );
};

export default TagsIndexPage;

export const getStaticProps: GetStaticProps = async () => {
  if (!process.env.NOTION_DATABASE_ID) throw new Error('NOTION_DATABASE_ID is not defined');
  const databaseItems = await getNotionDBItems(process.env.NOTION_DATABASE_ID);
  const tags = getTags(databaseItems);

  return {
    props: {
      tags,
    },
  };
};
