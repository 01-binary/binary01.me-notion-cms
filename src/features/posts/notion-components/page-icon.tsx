import * as React from 'react';

import isUrl from 'is-url-superb';

import { DefaultPageIcon } from '@/features/posts/icons/default-page-icon';
import { cs, getBlockTitle } from '@/features/posts/notion-components/utils';
import { Block, CalloutBlock, PageBlock } from '@/interfaces/notion-block';

import { getBlockIcon } from '@/utils/previewImage';

import { useNotionContext } from '../context';
import { LazyImage } from './lazy-image';

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === 'page' ||
    value.type === 'callout' ||
    value.type === 'collection_view' ||
    value.type === 'collection_view_page'
  );
};

export const PageIconImpl: React.FC<{
  block: Block;
  className?: string;
  inline?: boolean;
  hideDefaultIcon?: boolean;
  defaultIcon?: string;
}> = ({ block, className, inline = true, hideDefaultIcon = false, defaultIcon }) => {
  const { mapImageUrl, recordMap, darkMode } = useNotionContext();
  let isImage = false;
  let content: any = null;

  if (isIconBlock(block)) {
    const icon = getBlockIcon(block, recordMap)?.trim() || defaultIcon;
    const title = getBlockTitle(block, recordMap);

    if (icon && isUrl(icon)) {
      const url = mapImageUrl(icon, block);
      isImage = true;

      content = (
        <LazyImage
          src={url}
          alt={title || 'page icon'}
          className={cs(className, 'notion-page-icon')}
        />
      );
    } else if (icon && icon.startsWith('/icons/')) {
      const url = 'https://www.notion.so' + icon + '?mode=' + (darkMode ? 'dark' : 'light');

      content = (
        <LazyImage
          src={url}
          alt={title || 'page icon'}
          className={cs(className, 'notion-page-icon')}
        />
      );
    } else if (!icon) {
      if (!hideDefaultIcon) {
        isImage = true;
        content = (
          <DefaultPageIcon
            className={cs(className, 'notion-page-icon')}
            alt={title ? title : 'page icon'}
          />
        );
      }
    } else {
      isImage = false;
      content = (
        <span
          className={cs(className, 'notion-page-icon')}
          role="img"
          aria-label={icon}
        >
          {icon}
        </span>
      );
    }
  }

  if (!content) {
    return null;
  }

  return (
    <div
      className={cs(
        inline ? 'notion-page-icon-inline' : 'notion-page-icon-hero',
        isImage ? 'notion-page-icon-image' : 'notion-page-icon-span',
      )}
    >
      {content}
    </div>
  );
};

export const PageIcon = React.memo(PageIconImpl);
