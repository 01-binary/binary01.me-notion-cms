'use client';

import { NotionBlock, Renderer } from 'notion-to-jsx';

interface PostRendererProps {
  blocks: NotionBlock[];
  title?: string;
  cover?: string;
}

const PostRenderer = ({ blocks, title, cover }: PostRendererProps) => {
  return (
    <Renderer
      blocks={blocks}
      title={title}
      cover={cover}
    />
  );
};

export default PostRenderer;
