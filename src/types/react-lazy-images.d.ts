import * as React from 'react';

import { LazyImageFullProps } from 'react-lazy-images';

declare module 'react-lazy-images' {
  class LazyImageFull extends React.Component<LazyImageFullProps> {
    render(): React.ReactNode; // render의 반환 타입만 ReactNode로 수정
  }
}
