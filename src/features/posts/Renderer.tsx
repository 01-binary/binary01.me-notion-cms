import React from 'react';

import dynamic from 'next/dynamic';
import nextImage from 'next/image';
import nextLink from 'next/link';
import { ExtendedRecordMap } from 'notion-types';
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
  recordMap: ExtendedRecordMap;
}

const PostRenderer = ({ recordMap }: Props) => {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage
      disableHeader
      showTableOfContents
      components={{
        Code,
        Collection,
        Equation,
        Pdf,
        Modal,
        nextLink,
        nextImage,
        // propertyDateValue: ({ data }) => data[0][1][0][1].start_date,
        // propertySelectValue: ({ option: { id, color, value: name } }) => (
        //   <TagItem
        //     key={id}
        //     tagItem={{
        //       color,
        //       id,
        //       name,
        //     }}
        //   />
        // ),
      }}
    />
  );
};

export default PostRenderer;
