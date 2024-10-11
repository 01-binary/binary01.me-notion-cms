import * as React from 'react';

import { Img, ImgProps } from 'react-image';

const isBrowser = typeof window !== 'undefined';

export const GracefulImage = (props: ImgProps) => {
  if (isBrowser) {
    return <Img {...props} />;
  } else {
    // @ts-expect-error (must use the appropriate subset of props for <img> if using SSR)
    return <img {...props} />;
  }
};
