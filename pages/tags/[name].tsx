import { ParsedUrlQuery } from 'querystring';

import { GetStaticPaths, GetStaticProps } from 'next';

import { Item } from '@/interfaces';
import { getNotionDBItems, getTags, parseItems } from '@/utils';

import CardList from '@/components/card/CardList';
import TagsIntro from '@/components/tag/TagsIntro';

interface Props {
  databaseItems: Item[];
  name: string;
}

const TagPage = ({ databaseItems, name }: Props) => {
  return (
    <div>
      <TagsIntro title={`#${name}`} />
      <CardList cardItems={databaseItems} />
    </div>
  );
};

export default TagPage;

interface TagsParams extends ParsedUrlQuery {
  name: string;
}

export const getStaticProps: GetStaticProps<Props, TagsParams> = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { name } = params!;

  const pascalTagName = name[0].toUpperCase() + name.slice(1);

  if (!process.env.NOTION_DATABASE_ID) throw new Error('NOTION_DATABASE_ID is not defined');
  const databaseItems = await getNotionDBItems(process.env.NOTION_DATABASE_ID, {
    filter: {
      tagName: name[0].toUpperCase() + name.slice(1),
    },
  });

  const parsedDatabaseItems = parseItems(databaseItems);

  return {
    props: {
      databaseItems: parsedDatabaseItems,
      name: pascalTagName,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  if (!process.env.NOTION_DATABASE_ID) throw new Error('NOTION_DATABASE_ID is not defined');
  const databaseItems = await getNotionDBItems(process.env.NOTION_DATABASE_ID);
  const tags = getTags(databaseItems);

  const paths = tags.map(({ name }) => ({
    params: {
      name: name.toLowerCase(),
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
