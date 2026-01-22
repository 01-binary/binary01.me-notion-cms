'use client';

import { type NotionBlock, Renderer } from 'notion-to-jsx';

import useDarkMode from '@/hooks/useDarkMode';

interface AboutRendererProps {
  blocks: NotionBlock[];
}

const AboutRenderer = ({ blocks }: AboutRendererProps) => {
  const isDarkMode = useDarkMode();

  return (
    <Renderer
      blocks={blocks}
      isDarkMode={isDarkMode}
    />
  );
};

export default AboutRenderer;
