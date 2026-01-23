import { formatNotionImageUrl } from 'notion-to-utils';

import { GetPageResponse, PostMeta } from '@/interfaces';
import {
  filterCategoryProperties,
  filterCoverProperties,
  filterDateProperties,
  filterDescSlugProperties,
  filterTitleProperties,
} from '@/utils/filterProperties';

/**
 * Notion 페이지 응답 배열을 PostMeta 배열로 변환합니다.
 *
 * @param notionPostsResponse - Notion API에서 받은 페이지 응답 배열
 * @returns 블로그 포스트 메타데이터 배열
 */
const getPostsMeta = (notionPostsResponse: GetPageResponse[]) => {
  const postsMeta = notionPostsResponse.reduce<PostMeta[]>((acc, item) => {
    if (!('properties' in item)) return acc;
    const { id, icon, cover } = item;
    const { Name, Category, Date, Desc, Slug } = item.properties;

    const postMeta: PostMeta = {
      id,
      icon,
      cover: formatNotionImageUrl(filterCoverProperties(cover), id),
      title: filterTitleProperties(Name),
      description: filterDescSlugProperties(Desc),
      slug: filterDescSlugProperties(Slug),
      category: filterCategoryProperties(Category),
      published: filterDateProperties(Date),
    };

    return [...acc, postMeta];
  }, []);

  return postsMeta;
};

export default getPostsMeta;
