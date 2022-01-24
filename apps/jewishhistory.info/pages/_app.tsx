import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import '@ifelseapps/lego/dist/components/Tooltip/Tooltip.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to jewishhistory.info!</title>
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
