import type { AppProps } from 'next/app';

import Layout from '@/components/layout';

import 'prismjs/themes/prism-tomorrow.css';

import 'notion-to-jsx/dist/index.css';
import '@/assets/styles/index.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
