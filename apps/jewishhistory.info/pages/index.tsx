import { FC } from 'react';
import * as fs from 'fs';

export const Index: FC<{ timeline: any }> = ({ timeline }) => {
  return (
    <div>
      <h1>Jewish history site</h1>
      <hr/>
      <ul>
        {Object.keys(timeline).map((era) => (
          <li key={era}>
            <div><strong><a href={`/content/${era}/`}>{timeline[era].name}</a></strong></div>
            <div>События:</div>
            <ul>
              {timeline[era].events.map(event => (
                <li key={event.code}><a href={`/content/${event.code}/`}>{event.name}</a></li>
              ))}
            </ul>
            <div>Люди:</div>
            <ul>
              {timeline[era].persons.map(person => (
                <li key={person.code}><a href={`/content/${person.code}/`}>{person.name}</a></li>
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
