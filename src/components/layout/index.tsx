import { PropsWithChildren } from 'react';

import Header from '@/components/layout/Header';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <div>footer</div>
    </>
  );
};

export default Layout;
