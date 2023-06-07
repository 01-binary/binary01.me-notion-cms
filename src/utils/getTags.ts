import { MultiSelectPropertyItemObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { getNotionDBItems } from '@/utils';

const getTags = (items: Awaited<ReturnType<typeof getNotionDBItems>>) => {
  const tags = items.reduce<MultiSelectPropertyItemObjectResponse['multi_select']>((acc, item) => {
    if (!('properties' in item)) return acc;

    const { Tags } = item.properties;

    const tags = Tags.type === 'multi_select' ? Tags.multi_select : [];

    tags.forEach((tag) => {
      const isAlreadyExist = acc.findIndex((accTag) => accTag.id === tag.id) > -1;

      if (!isAlreadyExist) acc.push(tag);
    });

    return acc;
  }, []);

  return tags;
};

export default getTags;
