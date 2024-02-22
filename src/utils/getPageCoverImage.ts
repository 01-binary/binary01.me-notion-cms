import { ExtendedRecordMap } from 'notion-types';
import { defaultMapImageUrl } from 'react-notion-x';

const getPageCoverImage = (recordMap: ExtendedRecordMap) => {
  const keys = Object.keys(recordMap.block);
  const block = recordMap.block[keys[0]].value;
  const url = (block.format?.page_cover as string) || '';
  const ogImage = defaultMapImageUrl(url, block);

  return ogImage;
};

export default getPageCoverImage;
