import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import '@ifelseapps/lego/dist/components/Tooltip/Tooltip.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to jewishhistory.info!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
