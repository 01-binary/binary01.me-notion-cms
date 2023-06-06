import { Item } from '@/interfaces';
import { getNotionDBItems } from '@/utils';

const parseItems = (items: Awaited<ReturnType<typeof getNotionDBItems>>) => {
  const parsedItems = items.reduce<Item[]>((acc, item) => {
    if (!('properties' in item)) return acc;
    console.log(item);
    const { id, icon, cover } = item;
    const { Name, Tags, Date, Desc } = item.properties;

    const parsedCover = cover?.type === 'file' ? cover.file.url : cover?.external.url ?? '';

    const title = Name?.type === 'title' ? Name?.title[0]?.plain_text : '';
    const description = Desc?.type === 'rich_text' ? Desc?.rich_text[0]?.plain_text : '';
    const tags = Tags?.type === 'multi_select' ? Tags?.multi_select : [];
    const published = (Date.type === 'date' ? Date.date?.start : '') ?? '';

    const parsedResult: Item = {
      id,
      icon,
      cover: parsedCover,
      title,
      description,
      tags,
      published,
    };

    return [...acc, parsedResult];
  }, []);

  return parsedItems;
};

export default parseItems;
