import * as React from 'react';

import { cs } from '@/features/posts/notion-components/utils';
import { AudioBlock } from '@/interfaces/notion-block';

import { useNotionContext } from '../context';

export const Audio: React.FC<{
  block: AudioBlock;
  className?: string;
}> = ({ block, className }) => {
  const { recordMap } = useNotionContext();
  const source = recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0];

  return (
    <div className={cs('notion-audio', className)}>
      <audio
        controls
        preload="none"
        src={source}
      />
    </div>
  );
};
