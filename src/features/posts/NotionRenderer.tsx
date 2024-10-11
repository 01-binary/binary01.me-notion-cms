import * as React from 'react';

import mediumZoom from '@fisch0920/medium-zoom';

import { ExtendedRecordMap, NotionComponents } from '@/interfaces/notion';

import { Block } from './block';
import { NotionContextProvider, useNotionContext } from './context';

export const NotionRenderer: React.FC<{
  recordMap: ExtendedRecordMap;
  fullPage?: boolean;
  disableHeader?: boolean;
  showTableOfContents?: boolean;
  previewImages?: boolean;
  components?: Partial<NotionComponents>;
}> = ({ recordMap, fullPage, disableHeader, showTableOfContents, previewImages, components }) => {
  const zoom = React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      mediumZoom({
        background: 'rgba(0, 0, 0, 0.8)',
        minZoomScale: 2.0,
        margin: getMediumZoomMargin(),
      }),
    [],
  );

  return (
    <NotionContextProvider
      recordMap={recordMap}
      fullPage={fullPage}
      showTableOfContents={showTableOfContents}
      previewImages={previewImages}
      components={components}
      zoom={zoom}
    >
      <NotionBlockRenderer disableHeader={disableHeader} />
    </NotionContextProvider>
  );
};

export const NotionBlockRenderer: React.FC<{
  className?: string;
  bodyClassName?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  disableHeader?: boolean;

  blockId?: string;
  hideBlockId?: boolean;
  level?: number;
}> = ({ level = 0, blockId, ...props }) => {
  const { recordMap } = useNotionContext();
  const id = blockId || Object.keys(recordMap.block)[0];
  const block = recordMap.block[id]?.value;

  if (!block) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('missing block', blockId);
    }

    return null;
  }

  return (
    <Block
      key={id}
      level={level}
      block={block}
      {...props}
    >
      {block?.content?.map((contentBlockId) => (
        <NotionBlockRenderer
          key={contentBlockId}
          blockId={contentBlockId}
          level={level + 1}
          {...props}
        />
      ))}
    </Block>
  );
};

function getMediumZoomMargin() {
  const width = window.innerWidth;

  if (width < 500) {
    return 8;
  } else if (width < 800) {
    return 20;
  } else if (width < 1280) {
    return 30;
  } else if (width < 1600) {
    return 40;
  } else if (width < 1920) {
    return 48;
  } else {
    return 72;
  }
}
