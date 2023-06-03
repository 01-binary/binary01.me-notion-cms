import type { AppProps } from 'next/app';

import Layout from '@/components/layout';

import 'pretendard/dist/web/variable/pretendardvariable.css';
import '@/assets/styles/index.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
