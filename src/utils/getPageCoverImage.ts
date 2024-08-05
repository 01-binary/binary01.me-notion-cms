import { ExtendedRecordMap } from '@/interfaces/notion';

import { defaultMapImageUrl } from '@/utils/previewImage';

const getPageCoverImage = (recordMap: ExtendedRecordMap) => {
  const keys = Object.keys(recordMap.block);
  const block = recordMap.block[keys[0]].value;
  const url = (block.format?.page_cover as string) || '';
  const ogImage = defaultMapImageUrl(url, block as Parameters<typeof defaultMapImageUrl>[1]);

  return ogImage;
};

export default getPageCoverImage;
