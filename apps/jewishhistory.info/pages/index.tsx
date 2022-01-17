import { FC } from 'react';
import * as fs from 'fs';

export const Index: FC<{ index: any }> = ({ index }) => {
  return (
    <div>
      <h1>Jewish history site</h1>
      <hr/>
      <h2></h2>
    </div>
  );
};

export default Index;

export function getStaticProps() {
  const index = JSON.parse(fs.readFileSync('./apps/jewishhistory.info/pages/content/index.json', { encoding: 'utf8' }));
  return {
    props: { index },
  };
}
