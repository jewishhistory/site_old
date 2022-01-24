import { FC } from 'react';
import * as fs from 'fs';
import { Timeline as TimelineType } from 'types/Timeline';
import { Timeline } from '../components/Timeline';

export const Index: FC<{ timeline: TimelineType }> = ({ timeline }) => {

  return (
    <div style={{ padding: '1em' }}>
      <h1>Jewish history site</h1>
      <hr/>
      <Timeline timeline={timeline}/>
    </div>
  );
};

export default Index;

export function getStaticProps() {
  const timeline = JSON.parse(fs.readFileSync('./apps/jewishhistory.info/pages/content/timeline.json', { encoding: 'utf8' }));
  return {
    props: { timeline },
  };
}
