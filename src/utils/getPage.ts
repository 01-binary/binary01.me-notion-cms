import pMap from 'p-map';

import {
  CollectionInstance,
  ExtendedRecordMap,
  PageChunk,
  SignedUrlRequest,
  SignedUrlResponse,
} from '@/interfaces/notion';
import { Block } from '@/interfaces/notion-block';
import { CollectionViewType } from '@/interfaces/notion-collection-view';

const idToUuid = (id = '') =>
  `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;

const pageIdRe = /\b([a-f0-9]{32})\b/;
const pageId2Re = /\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/;

/**
 * Robustly extracts the notion page ID from a notion URL or pathname suffix.
 *
 * Defaults to returning a UUID (with dashes).
 */
export const parsePageId = (id: string | null = '', { uuid = true }: { uuid?: boolean } = {}) => {
  if (!id) {
    return null;
  }

  id = id.split('?')[0];
  const match = id.match(pageIdRe);

  if (match) {
    return uuid ? idToUuid(match[1]) : match[1];
  }

  const match2 = id.match(pageId2Re);
  if (match2) {
    return uuid ? match2[1] : match2[1].replace(/-/g, '');
  }

  return null;
};

const apiBaseUrl = 'https://www.notion.so/api/v3';

const notionFetch = async <T>({
  endpoint,
  body,
  headers: clientHeaders,
}: {
  endpoint: string;
  body: object;
  headers?: any;
}): Promise<T> => {
  const headers: any = {
    ...clientHeaders,
    'Content-Type': 'application/json',
  };

  // if (this._authToken) {
  //   headers.cookie = `token_v2=${this._authToken}`;
  // }

  // if (this._activeUser) {
  //   headers['x-notion-active-user-header'] = this._activeUser;
  // }

  const url = `${apiBaseUrl}/${endpoint}`;
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers,
  }).then((res) => {
    console.log(endpoint, res);
    return res.json();
  });
};

const getPageRaw = (
  pageId: string,
  {
    chunkLimit = 100,
    chunkNumber = 0,
  }: {
    chunkLimit?: number;
    chunkNumber?: number;
  } = {},
) => {
  const parsedPageId = parsePageId(pageId);

  if (!parsedPageId) {
    throw new Error(`invalid notion pageId "${pageId}"`);
  }

  const body = {
    pageId: parsedPageId,
    limit: chunkLimit,
    chunkNumber: chunkNumber,
    cursor: { stack: [] },
    verticalColumns: false,
  };

  return notionFetch<PageChunk>({
    endpoint: 'loadPageChunk',
    body,
  });
};

const getPageContentBlockIds = (recordMap: ExtendedRecordMap, blockId?: string): string[] => {
  const rootBlockId = blockId || Object.keys(recordMap.block)[0];
  const contentBlockIds = new Set<string>();

  function addContentBlocks(blockId: string) {
    if (contentBlockIds.has(blockId)) return;
    contentBlockIds.add(blockId);

    const block = recordMap.block[blockId]?.value;
    if (!block) return;

    const { content, type, properties, format } = block;
    if (properties) {
      // TODO: this needs some love, especially for resolving relation properties
      // see this collection_view_page for an example: 8a586d253f984b85b48254da84465d23
      for (const key of Object.keys(properties)) {
        const p = properties[key];
        p.map((d: any) => {
          const value = d?.[0]?.[1]?.[0];
          if (value?.[0] === 'p' && value[1]) {
            addContentBlocks(value[1]);
          }
        });

        // [["‣", [["p", "841918aa-f2a3-4d4c-b5ad-64b0f57c47b8"]]]]
        const value = p?.[0]?.[1]?.[0];

        if (value?.[0] === 'p' && value[1]) {
          addContentBlocks(value[1]);
        }
      }
    }

    if (format) {
      const referenceId = format.transclusion_reference_pointer?.id;
      if (referenceId) {
        addContentBlocks(referenceId);
      }
    }

    if (!content || !Array.isArray(content)) {
      // no child content blocks to recurse on
      return;
    }

    if (blockId !== rootBlockId) {
      if (type === 'page' || type === 'collection_view_page') {
        // ignore the content of other pages and collections
        return;
      }
    }

    for (const blockId of content) {
      addContentBlocks(blockId);
    }
  }

  addContentBlocks(rootBlockId);
  return Array.from(contentBlockIds);
};

const getBlocks = (blockIds: string[]) => {
  return notionFetch<PageChunk>({
    endpoint: 'syncRecordValues',
    body: {
      requests: blockIds.map((blockId) => ({
        // TODO: when to use table 'space' vs 'block'?
        table: 'block',
        id: blockId,
        version: -1,
      })),
    },
  });
};

const getBlockCollectionId = (block: Block, recordMap: ExtendedRecordMap): string | null => {
  const collectionId =
    (block as any).collection_id || (block as any).format?.collection_pointer?.id;

  if (collectionId) {
    return collectionId;
  }

  const collectionViewId = (block as any)?.view_ids?.[0];
  if (collectionViewId) {
    const collectionView = recordMap.collection_view?.[collectionViewId]?.value;
    if (collectionView) {
      const collectionId = collectionView.format?.collection_pointer?.id;
      return collectionId;
    }
  }

  return null;
};

const getCollectionData = (
  collectionId: string,
  collectionViewId: string,
  collectionView: any,
  {
    limit = 9999,
    searchQuery = '',
    userTimeZone = 'America/New_York',
    loadContentCover = true,
  }: {
    type?: CollectionViewType;
    limit?: number;
    searchQuery?: string;
    userTimeZone?: string;
    userLocale?: string;
    loadContentCover?: boolean;
  } = {},
) => {
  const type = collectionView?.type;
  const isBoardType = type === 'board';
  const groupBy = isBoardType
    ? collectionView?.format?.board_columns_by
    : collectionView?.format?.collection_group_by;

  let filters = [];
  if (collectionView?.format?.property_filters) {
    filters = collectionView.format?.property_filters.map((filterObj) => {
      //get the inner filter
      return {
        filter: filterObj?.filter?.filter,
        property: filterObj?.filter?.property,
      };
    });
  }

  //Fixes formula filters from not working
  if (collectionView?.query2?.filter?.filters) {
    filters.push(...collectionView.query2.filter.filters);
  }

  let loader: any = {
    type: 'reducer',
    reducers: {
      collection_group_results: {
        type: 'results',
        limit,
        loadContentCover,
      },
    },
    sort: [],
    ...collectionView?.query2,
    filter: {
      filters: filters,
      operator: 'and',
    },
    searchQuery,
    userTimeZone,
  };

  if (groupBy) {
    const groups =
      collectionView?.format?.board_columns || collectionView?.format?.collection_groups || [];
    const iterators = [isBoardType ? 'board' : 'group_aggregation', 'results'];
    const operators = {
      checkbox: 'checkbox_is',
      url: 'string_starts_with',
      text: 'string_starts_with',
      select: 'enum_is',
      multi_select: 'enum_contains',
      created_time: 'date_is_within',
      ['undefined']: 'is_empty',
    };

    const reducersQuery = {};
    for (const group of groups) {
      const {
        property,
        value: { value, type },
      } = group;

      for (const iterator of iterators) {
        const iteratorProps =
          iterator === 'results'
            ? {
                type: iterator,
                limit,
              }
            : {
                type: 'aggregation',
                aggregation: {
                  aggregator: 'count',
                },
              };

        const isUncategorizedValue = typeof value === 'undefined';
        const isDateValue = value?.range;
        // TODO: review dates reducers
        const queryLabel = isUncategorizedValue
          ? 'uncategorized'
          : isDateValue
          ? value.range?.start_date || value.range?.end_date
          : value?.value || value;

        const queryValue = !isUncategorizedValue && (isDateValue || value?.value || value);

        reducersQuery[`${iterator}:${type}:${queryLabel}`] = {
          ...iteratorProps,
          filter: {
            operator: 'and',
            filters: [
              {
                property,
                filter: {
                  operator: !isUncategorizedValue ? operators[type] : 'is_empty',
                  ...(!isUncategorizedValue && {
                    value: {
                      type: 'exact',
                      value: queryValue,
                    },
                  }),
                },
              },
            ],
          },
        };
      }
    }

    const reducerLabel = isBoardType ? 'board_columns' : `${type}_groups`;
    loader = {
      type: 'reducer',
      reducers: {
        [reducerLabel]: {
          type: 'groups',
          groupBy,
          ...(collectionView?.query2?.filter && {
            filter: collectionView?.query2?.filter,
          }),
          groupSortPreference: groups.map((group) => group?.value),
          limit,
        },
        ...reducersQuery,
      },
      ...collectionView?.query2,
      searchQuery,
      userTimeZone,
      //TODO: add filters here
      filter: {
        filters: filters,
        operator: 'and',
      },
    };
  }

  // if (isBoardType) {
  //   console.log(
  //     JSON.stringify(
  //       {
  //         collectionId,
  //         collectionViewId,
  //         loader,
  //         groupBy: groupBy || 'NONE',
  //         collectionViewQuery: collectionView.query2 || 'NONE'
  //       },
  //       null,
  //       2
  //     )
  //   )
  // }

  return notionFetch<CollectionInstance>({
    endpoint: 'queryCollection',
    body: {
      collection: {
        id: collectionId,
      },
      collectionView: {
        id: collectionViewId,
      },
      loader,
    },
  });
};

const getSignedFileUrls = async (urls: SignedUrlRequest[]) => {
  return notionFetch<SignedUrlResponse>({
    endpoint: 'getSignedFileUrls',
    body: {
      urls,
    },
  });
};

const addSignedUrls = async ({
  recordMap,
  contentBlockIds,
}: {
  recordMap: ExtendedRecordMap;
  contentBlockIds?: string[];
}) => {
  recordMap.signed_urls = {};

  if (!contentBlockIds) {
    contentBlockIds = getPageContentBlockIds(recordMap);
  }

  const allFileInstances = contentBlockIds.flatMap((blockId) => {
    const block = recordMap.block[blockId]?.value;

    if (
      block &&
      (block.type === 'pdf' ||
        block.type === 'audio' ||
        (block.type === 'image' && block.file_ids?.length) ||
        block.type === 'video' ||
        block.type === 'file' ||
        block.type === 'page')
    ) {
      const source =
        block.type === 'page' ? block.format?.page_cover : block.properties?.source?.[0]?.[0];
      // console.log(block, source)

      if (source) {
        if (!source.includes('secure.notion-static.com')) {
          return [];
        }

        return {
          permissionRecord: {
            table: 'block',
            id: block.id,
          },
          url: source,
        };
      }
    }

    return [];
  });

  if (allFileInstances.length > 0) {
    try {
      const { signedUrls } = await getSignedFileUrls(allFileInstances);

      if (signedUrls.length === allFileInstances.length) {
        for (let i = 0; i < allFileInstances.length; ++i) {
          const file = allFileInstances[i];
          const signedUrl = signedUrls[i];

          recordMap.signed_urls[file.permissionRecord.id] = signedUrl;
        }
      }
    } catch (err) {
      console.warn('NotionAPI getSignedfileUrls error', err);
    }
  }
};

const getPage = async (
  pageId: string,
  {
    concurrency = 3,
    fetchMissingBlocks = true,
    fetchCollections = true,
    signFileUrls = true,
    chunkLimit = 100,
    chunkNumber = 0,
  }: {
    concurrency?: number;
    fetchMissingBlocks?: boolean;
    fetchCollections?: boolean;
    signFileUrls?: boolean;
    chunkLimit?: number;
    chunkNumber?: number;
  } = {},
): Promise<ExtendedRecordMap> => {
  const page = await getPageRaw(pageId, {
    chunkLimit,
    chunkNumber,
  });
  const recordMap = page?.recordMap as ExtendedRecordMap;

  if (!recordMap?.block) {
    throw new Error(`Notion page not found
      `);
    // "${uuidToId(pageId)}"
  }

  // ensure that all top-level maps exist
  recordMap.collection = recordMap.collection ?? {};
  recordMap.collection_view = recordMap.collection_view ?? {};
  recordMap.notion_user = recordMap.notion_user ?? {};

  // additional mappings added for convenience
  // note: these are not native notion objects
  recordMap.collection_query = {};
  recordMap.signed_urls = {};

  if (fetchMissingBlocks) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // fetch any missing content blocks
      const pendingBlockIds = getPageContentBlockIds(recordMap).filter(
        (id) => !recordMap.block[id],
      );

      if (!pendingBlockIds.length) {
        break;
      }

      const newBlocks = await getBlocks(pendingBlockIds).then((res) => res.recordMap.block);

      recordMap.block = { ...recordMap.block, ...newBlocks };
    }
  }

  const contentBlockIds = getPageContentBlockIds(recordMap);

  // Optionally fetch all data for embedded collections and their associated views.
  // NOTE: We're eagerly fetching *all* data for each collection and all of its views.
  // This is really convenient in order to ensure that all data needed for a given
  // Notion page is readily available for use cases involving server-side rendering
  // and edge caching.
  if (fetchCollections) {
    const allCollectionInstances: Array<{
      collectionId: string;
      collectionViewId: string;
    }> = contentBlockIds.flatMap((blockId) => {
      const block = recordMap.block[blockId].value;
      const collectionId =
        block &&
        (block.type === 'collection_view' || block.type === 'collection_view_page') &&
        getBlockCollectionId(block, recordMap);

      if (collectionId) {
        return block.view_ids?.map((collectionViewId) => ({
          collectionId,
          collectionViewId,
        }));
      } else {
        return [];
      }
    });

    // fetch data for all collection view instances
    await pMap(
      allCollectionInstances,
      async (collectionInstance) => {
        const { collectionId, collectionViewId } = collectionInstance;
        const collectionView = recordMap.collection_view[collectionViewId]?.value;

        try {
          const collectionData = await getCollectionData(
            collectionId,
            collectionViewId,
            collectionView,
          );

          // await fs.writeFile(
          //   `${collectionId}-${collectionViewId}.json`,
          //   JSON.stringify(collectionData.result, null, 2)
          // )

          recordMap.block = {
            ...recordMap.block,
            ...collectionData.recordMap.block,
          };

          recordMap.collection = {
            ...recordMap.collection,
            ...collectionData.recordMap.collection,
          };

          recordMap.collection_view = {
            ...recordMap.collection_view,
            ...collectionData.recordMap.collection_view,
          };

          recordMap.notion_user = {
            ...recordMap.notion_user,
            ...collectionData.recordMap.notion_user,
          };

          recordMap.collection_query![collectionId] = {
            ...recordMap.collection_query![collectionId],
            [collectionViewId]: (collectionData.result as any)?.reducerResults,
          };
        } catch (err) {
          // It's possible for public pages to link to private collections, in which case
          // Notion returns a 400 error
          console.warn('NotionAPI collectionQuery error', pageId, err.message);
          console.error(err);
        }
      },
      {
        concurrency,
      },
    );
  }

  // Optionally fetch signed URLs for any embedded files.
  // NOTE: Similar to collection data, we default to eagerly fetching signed URL info
  // because it is preferable for many use cases as opposed to making these API calls
  // lazily from the client-side.
  if (signFileUrls) {
    await addSignedUrls({ recordMap, contentBlockIds });
  }

  return recordMap;
};
export default getPage;
