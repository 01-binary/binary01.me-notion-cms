import getNotionPosts from '@/utils/getNotionPosts';

const getSlugs = (posts: Awaited<ReturnType<typeof getNotionPosts>>) => {
  const slugs = posts
    .map((post) => {
      if (!('properties' in post)) return null;

      const { Slug } = post.properties;
      const slug = Slug?.type === 'rich_text' ? Slug?.rich_text[0]?.plain_text || '' : '';

      return slug;
    }, [])
    .filter(Boolean);

  return slugs as string[];
};

export default getSlugs;
