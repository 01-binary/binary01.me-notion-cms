import { BlockMap, ExtendedRecordMap, ID } from '@/interfaces/notion';
import { Block, BlockType, PageBlock } from '@/interfaces/notion-block';
import { Collection } from '@/interfaces/notion-collection';

import { getBlockCollectionId } from '@/utils/getPage';
import { getTextContent } from '@/utils/getPageTitle';
import { getBlockIcon } from '@/utils/previewImage';

const youtubeDomains = new Set([
  'youtu.be',
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]);

export const getBlockParentPage = (
  block: Block,
  recordMap: ExtendedRecordMap,
  {
    inclusive = false,
  }: {
    inclusive?: boolean;
  } = {},
): PageBlock | null => {
  let currentRecord: Block | Collection = block;

  while (currentRecord != null) {
    if (inclusive && (currentRecord as Block)?.type === 'page') {
      return currentRecord as PageBlock;
    }

    const parentId: string = currentRecord.parent_id;
    const parentTable = currentRecord.parent_table;

    if (!parentId) {
      break;
    }

    if (parentTable === 'collection') {
      currentRecord = recordMap.collection[parentId]?.value;
    } else {
      currentRecord = recordMap.block[parentId]?.value;

      if ((currentRecord as Block)?.type === 'page') {
        return currentRecord as PageBlock;
      }
    }
  }

  return null;
};

export const uuidToId = (uuid: string) => uuid.replace(/-/g, '');

export const getYoutubeId = (url: string): string | null => {
  try {
    const { hostname } = new URL(url);
    if (!youtubeDomains.has(hostname)) {
      return null;
    }
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/i;

    const match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
  } catch {
    // ignore invalid urls
  }

  return null;
};

export const cs = (...classes: Array<string | undefined | false>) =>
  classes.filter((a) => !!a).join(' ');

const groupBlockContent = (blockMap: BlockMap): string[][] => {
  const output: string[][] = [];

  let lastType: string | undefined = undefined;
  let index = -1;

  Object.keys(blockMap).forEach((id) => {
    const blockValue = blockMap[id]?.value;

    if (blockValue) {
      blockValue.content?.forEach((blockId) => {
        const blockType = blockMap[blockId]?.value?.type;

        if (blockType && blockType !== lastType) {
          index++;
          lastType = blockType;
          output[index] = [];
        }

        if (index > -1) {
          output[index].push(blockId);
        }
      });
    }

    lastType = undefined;
  });

  return output;
};

export const getListNumber = (blockId: string, blockMap: BlockMap) => {
  const groups = groupBlockContent(blockMap);
  const group = groups.find((g) => g.includes(blockId));

  if (!group) {
    return;
  }

  return group.indexOf(blockId) + 1;
};

export interface TableOfContentsEntry {
  id: ID;
  type: BlockType;
  text: string;
  indentLevel: number;
}

const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2,
};

/**
 * Gets the metadata for a table of contents block by parsing the page's
 * H1, H2, and H3 elements.
 */
export const getPageTableOfContents = (
  page: PageBlock,
  recordMap: ExtendedRecordMap,
): Array<TableOfContentsEntry> => {
  const toc = (page.content ?? [])
    .map((blockId: string) => {
      const block = recordMap.block[blockId]?.value;

      if (block) {
        const { type } = block;

        if (type === 'header' || type === 'sub_header' || type === 'sub_sub_header') {
          return {
            id: blockId,
            type,
            text: getTextContent(block.properties?.title),
            indentLevel: indentLevels[type],
          };
        }
      }

      return null;
    })
    .filter(Boolean) as Array<TableOfContentsEntry>;

  const indentLevelStack = [
    {
      actual: -1,
      effective: -1,
    },
  ];

  // Adjust indent levels to always change smoothly.
  // This is a little tricky, but the key is that when increasing indent levels,
  // they should never jump more than one at a time.
  for (const tocItem of toc) {
    const { indentLevel } = tocItem;
    const actual = indentLevel;

    do {
      const prevIndent = indentLevelStack[indentLevelStack.length - 1];
      const { actual: prevActual, effective: prevEffective } = prevIndent;

      if (actual > prevActual) {
        tocItem.indentLevel = prevEffective + 1;
        indentLevelStack.push({
          actual,
          effective: tocItem.indentLevel,
        });
      } else if (actual === prevActual) {
        tocItem.indentLevel = prevEffective;
        break;
      } else {
        indentLevelStack.pop();
      }

      // eslint-disable-next-line no-constant-condition
    } while (true);
  }

  return toc;
};

export const formatDate = (
  input: string | number,
  { month = 'short' }: { month?: 'long' | 'short' } = {},
) => {
  const date = new Date(input);
  const monthLocale = date.toLocaleString('en-US', { month });
  return `${monthLocale} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
};

export interface NotionDateTime {
  type: 'datetime';
  start_date: string;
  start_time?: string;
  time_zone?: string;
}

export const formatNotionDateTime = (datetime: NotionDateTime) => {
  // Adding +00:00 preserve the time in UTC.
  const dateString = `${datetime.start_date}T${datetime.start_time || '00:00'}+00:00`;
  return formatDate(dateString);
};

export function getBlockTitle(block: Block, recordMap: ExtendedRecordMap) {
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

export const getHashFragmentValue = (url: string) => {
  return url.includes('#') ? url.replace(/^.+(#.+)$/, '$1') : '';
};

export const getPageBreadcrumbs = (
  recordMap: ExtendedRecordMap,
  activePageId: string,
): Array<any> => {
  const blockMap = recordMap.block;
  const breadcrumbs = [];

  let currentPageId = activePageId;

  do {
    const block = blockMap[currentPageId]?.value;
    if (!block) {
      break;
    }

    const title = getBlockTitle(block, recordMap);
    const icon = getBlockIcon(block, recordMap);

    if (!(title || icon)) {
      break;
    }

    breadcrumbs.push({
      block,
      active: currentPageId === activePageId,
      pageId: currentPageId,
      title,
      icon,
    });

    const parentBlock = getBlockParentPage(block, recordMap);
    const parentId = parentBlock?.id;

    if (!parentId) {
      break;
    }

    currentPageId = parentId;

    // eslint-disable-next-line no-constant-condition
  } while (true);

  breadcrumbs.reverse();

  return breadcrumbs;
};
