'use client';

import { type NotionBlock, Renderer } from 'notion-to-jsx';

import useDarkMode from '@/hooks/useDarkMode';

interface PostRendererProps {
  blocks: NotionBlock[];
  title?: string;
  cover?: string;
}

const PostRenderer = ({ blocks, title, cover }: PostRendererProps) => {
  const isDarkMode = useDarkMode();

  return (
    <Renderer
      blocks={blocks}
      title={title}
      cover={cover}
      isDarkMode={isDarkMode}
      showToc
      tocStyle={{
        scrollOffset: 60,
      }}
    />
  );
};

export default PostRenderer;
