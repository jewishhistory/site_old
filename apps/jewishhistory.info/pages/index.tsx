import { FC } from 'react';
import Link from 'next/link';
import * as fs from 'fs';

export const Index: FC<{ timeline: any }> = ({ timeline }) => {
  return (
    <div>
      <h1>Jewish history site</h1>
      <hr/>
      <ul>
        {Object.keys(timeline).map((era) => (
          <li key={era}>
            <div><strong><Link href={`/content/${era}/`}><a>{timeline[era].name}</a></Link></strong></div>
            <div>События:</div>
            <ul>
              {timeline[era].events.map(event => (
                <li key={event.code}><Link href={`/content/${event.code}/`}><a>{event.name}</a></Link></li>
              ))}
            </ul>
            <div>Люди:</div>
            <ul>
              {timeline[era].persons.map(person => (
                <li key={person.code}><Link href={`/content/${person.code}/`}><a>{person.name}</a></Link></li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
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
