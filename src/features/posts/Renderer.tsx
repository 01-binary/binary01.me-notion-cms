import dynamic from 'next/dynamic';
import nextImage from 'next/image';
import nextLink from 'next/link';
import { NotionRenderer } from 'react-notion-x';

const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((m) => m.Code), {
  ssr: false,
});

const Collection = dynamic(
  () => import('react-notion-x/build/third-party/collection').then((m) => m.Collection),
  {
    ssr: false,
  },
);

const Equation = dynamic(
  () => import('react-notion-x/build/third-party/equation').then((m) => m.Equation),
  {
    ssr: false,
  },
);

const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), {
  ssr: false,
});

const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), {
  ssr: false,
});

interface Props {
  recordMap: Parameters<typeof NotionRenderer>[0]['recordMap'];
}

const PostRenderer = ({ recordMap }: Props) => {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage
      disableHeader
      showTableOfContents
      previewImages={!!recordMap?.preview_images}
      components={{
        Code,
        Collection,
        Equation,
        Pdf,
        Modal,
        nextLink,
        nextImage,
      }}
    />
  );
};

export default PostRenderer;
