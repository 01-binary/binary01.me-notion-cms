import { Decoration, ExtendedRecordMap } from '@/interfaces/notion';
import { Block } from '@/interfaces/notion-block';

import { getBlockCollectionId } from '@/utils/getPage';

export function getPageTitle(recordMap: ExtendedRecordMap) {
  const pageBlock = recordMap.block[Object.keys(recordMap.block)[0]]?.value;

  if (pageBlock) {
    return getBlockTitle(pageBlock, recordMap);
  }

  return null;
}

function getBlockTitle(block: Block, recordMap: ExtendedRecordMap) {
  if (block.properties?.title) {
    return getTextContent(block.properties.title);
  }

  if (block.type === 'collection_view_page' || block.type === 'collection_view') {
    const collectionId = getBlockCollectionId(block, recordMap);

    if (collectionId) {
      const collection = recordMap.collection[collectionId]?.value;

      if (collection) {
        return getTextContent(collection.name);
      }
    }
  }

  return '';
}

const getTextContent = (text?: Decoration[]): string => {
  if (!text) {
    return '';
  } else if (Array.isArray(text)) {
    return (
      text?.reduce(
        (prev, current) => prev + (current[0] !== '⁍' && current[0] !== '‣' ? current[0] : ''),
        '',
      ) ?? ''
    );
  } else {
    return text;
  }
};
