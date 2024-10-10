import isUrl from 'is-url-superb';
import lqip from 'lqip-modern';

import { Post } from '@/interfaces';
import { ExtendedRecordMap, PreviewImage, PreviewImageMap } from '@/interfaces/notion';
import { Block, PageBlock } from '@/interfaces/notion-block';

import { getBlockCollectionId } from '@/utils/getPage';

const getBlockIcon = (block: Block, recordMap: ExtendedRecordMap) => {
  if ((block as PageBlock).format?.page_icon) {
    return (block as PageBlock).format?.page_icon;
  }

  if (block.type === 'collection_view_page' || block.type === 'collection_view') {
    const collectionId = getBlockCollectionId(block, recordMap);
    if (collectionId) {
      const collection = recordMap.collection[collectionId]?.value;

      if (collection) {
        return collection.icon;
      }
    }
  }

  return null;
};

const getPageImageUrls = (
  recordMap: ExtendedRecordMap,
  {
    mapImageUrl,
  }: {
    mapImageUrl: (url: string, block: Block) => string | null;
  },
): string[] => {
  const blockIds = Object.keys(recordMap.block);
  const imageUrls = blockIds
    .flatMap((blockId) => {
      const block = recordMap.block[blockId]?.value;
      const images: Array<{ block: Block; url: string }> = [];

      if (block) {
        if (block.type === 'image') {
          const signedUrl = recordMap.signed_urls?.[block.id];
          let source = signedUrl || block.properties?.source?.[0]?.[0];
          if (source.includes('file.notion.so')) {
            source = block.properties?.source?.[0]?.[0];
          }

          if (source) {
            images.push({
              block,
              url: source,
            });
          }
        }

        if ((block.format as any)?.page_cover) {
          const source = (block.format as any).page_cover;

          images.push({
            block,
            url: source,
          });
        }

        if ((block.format as any)?.bookmark_cover) {
          const source = (block.format as any).bookmark_cover;

          images.push({
            block,
            url: source,
          });
        }

        if ((block.format as any)?.bookmark_icon) {
          const source = (block.format as any).bookmark_icon;

          images.push({
            block,
            url: source,
          });
        }

        const pageIcon = getBlockIcon(block, recordMap);
        if (pageIcon && isUrl(pageIcon)) {
          images.push({
            block,
            url: pageIcon,
          });
        }
      }

      return images;
    })
    .filter(Boolean)
    .map(({ block, url }) => mapImageUrl(url, block))
    .filter(Boolean) as string[];

  return Array.from(new Set(imageUrls));
};

export const makePreviewImage = async (url: string) => {
  try {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    const {
      metadata: { dataURIBase64, originalHeight, originalWidth },
    } = await lqip(buffer);
    const result: PreviewImage = {
      dataURIBase64,
      originalHeight,
      originalWidth,
    };
    return result;
  } catch (error) {
    return null;
  }
};

export const getPreviewImages = async (posts: Post[]) => {
  const postsWithPreview = Promise.all(
    posts.map(async (post) => {
      const { id, cover } = post;

      const previewImage = await makePreviewImage(cover);
      const coverFromNotion = `/api/cover-image?pageId=${id}`;
      return {
        ...post,
        previewImage,
        cover: coverFromNotion,
      };
    }),
  );

  return postsWithPreview;
};

export const getPreviewImageFromRecordMap = async (
  recordMap: ExtendedRecordMap,
): Promise<PreviewImageMap | undefined> => {
  const urls = getPageImageUrls(recordMap, {
    mapImageUrl: defaultMapImageUrl,
  });

  const previewImageMap = await Promise.all(
    urls.map(async (url) => [url, await makePreviewImage(url)]),
  );

  return Object.fromEntries(previewImageMap);
};

export const defaultMapImageUrl = (url: string, block: Block): string | null => {
  if (!url) {
    return null;
  }

  if (url.startsWith('data:')) {
    return url;
  }

  // more recent versions of notion don't proxy unsplash images
  if (url.startsWith('https://images.unsplash.com')) {
    return url;
  }

  try {
    const u = new URL(url);

    if (
      u.pathname.startsWith('/secure.notion-static.com') &&
      u.hostname.endsWith('.amazonaws.com')
    ) {
      if (
        u.searchParams.has('X-Amz-Credential') &&
        u.searchParams.has('X-Amz-Signature') &&
        u.searchParams.has('X-Amz-Algorithm')
      ) {
        // if the URL is already signed, then use it as-is
        return url;
      }
    }
  } catch {
    // ignore invalid urls
  }

  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`;
  }

  url = `https://www.notion.so${
    url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
  }`;

  const notionImageUrlV2 = new URL(url);
  let table = block.parent_table === 'space' ? 'block' : block.parent_table;
  if (table === 'collection' || table === 'team') {
    table = 'block';
  }
  notionImageUrlV2.searchParams.set('table', table);
  notionImageUrlV2.searchParams.set('id', block.id);
  notionImageUrlV2.searchParams.set('cache', 'v2');

  url = notionImageUrlV2.toString();

  return url;
};
