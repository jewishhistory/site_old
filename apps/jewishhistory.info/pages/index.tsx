import { FC } from 'react';
import Link from 'next/link';
import * as fs from 'fs';
import { Timeline } from 'types/Timeline';
import { displayYear } from '../utils/dates';
import { Tooltip } from '@ifelseapps/lego/dist/components/Tooltip';
import calendar from './calendar.svg';

export const Index: FC<{ timeline: Timeline }> = ({ timeline }) => {

  return (
    <div>
      <h1>Jewish history site</h1>
      <hr/>
      <ul>
        {timeline.map((era) => (
          <li key={era.code}>
            <div><strong><Link href={`/content/${era.code}/`}><a>{era.name}</a></Link></strong></div>
            <div>События:</div>
            <ul>
              {era.events.map(event => (
                <li key={event.code}>
                  <Link href={`/content/${event.code}/`}><a>{event.name}</a></Link>
                  {' '}
                  {event.dateStartNonStrict
                    ? <Tooltip render={() => <div><img src={calendar.src} width={16} height={16} /> Точная дата неизвестна</div>}><img width={16} height={16} src={calendar.src} /></Tooltip>
                    : displayYear(event.dateStart)}
                </li>
              ))}
            </ul>
            <div>Люди:</div>
            <ul>
              {era.persons.map(person => (
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
