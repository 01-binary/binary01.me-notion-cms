import type { AppProps } from 'next/app';

import Layout from '@/components/layout';

import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';
import '@/assets/styles/index.css';
import '@/assets/styles/notion-x.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
