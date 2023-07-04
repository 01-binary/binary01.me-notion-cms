import { ExtendedRecordMap, PageBlock } from 'notion-types';
import { defaultMapImageUrl } from 'react-notion-x';

const getPageCoverImage = (recordMap: ExtendedRecordMap) => {
  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  const ogImage = defaultMapImageUrl((block as PageBlock).format?.page_cover as string, block);

  return ogImage;
};

export default getPageCoverImage;
