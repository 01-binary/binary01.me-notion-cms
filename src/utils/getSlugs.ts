import { GetPageResponse } from '@/interfaces';
import { filterDescSlugProperties } from '@/utils/filterProperties';

const getSlugs = (notionPostsResponse: GetPageResponse[]) => {
  const slugs = notionPostsResponse
    .map((post) => {
      if (!('properties' in post)) return null;

      const { Slug } = post.properties;
      const slug = filterDescSlugProperties(Slug);

      return slug;
    }, [])
    .filter((slug): slug is string => slug !== null);

  return slugs;
};

export default getSlugs;
