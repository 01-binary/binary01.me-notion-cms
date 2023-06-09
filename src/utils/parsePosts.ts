import { Post } from '@/interfaces';
import { getNotionPosts } from '@/utils';

const parsePosts = (posts: Awaited<ReturnType<typeof getNotionPosts>>) => {
  const parsedPosts = posts.reduce<Post[]>((acc, item) => {
    if (!('properties' in item)) return acc;
    const { id, icon, cover } = item;
    const { Name, Category, Date, Desc } = item.properties;
    const parsedCover = cover?.type === 'file' ? cover.file.url : cover?.external.url ?? '';
    const title = Name?.type === 'title' ? Name?.title[0]?.plain_text : '';
    const description = Desc?.type === 'rich_text' ? Desc?.rich_text[0]?.plain_text : '';
    const category = Category?.type === 'multi_select' ? Category?.multi_select[0] : null;
    const published = (Date.type === 'date' ? Date.date?.start : '') ?? '';

    const parsedPost: Post = {
      id,
      icon,
      cover: parsedCover,
      title,
      description,
      category,
      published,
    };

    return [...acc, parsedPost];
  }, []);

  return parsedPosts;
};

export default parsePosts;
