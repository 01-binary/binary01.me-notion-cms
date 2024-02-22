import { GetPageResponse, SlugAndDate } from '@/interfaces';

import {
  filterDatePropertiesToISOString,
  filterDescSlugProperties,
} from '@/utils/filterProperties';

const getSlugsAndDates = (notionPostsResponse: GetPageResponse[]) => {
  const slugsAndDates = notionPostsResponse
    .map((post) => {
      if (!('properties' in post)) return null;

      const { Slug, Date } = post.properties;
      const slug = filterDescSlugProperties(Slug);
      const published = filterDatePropertiesToISOString(Date);

      return { slug, published };
    }, [])
    .filter((slugAndDate: SlugAndDate | null): slugAndDate is SlugAndDate =>
      slugAndDate ? 'slug' in slugAndDate : false,
    );

  return slugsAndDates;
};

export default getSlugsAndDates;
