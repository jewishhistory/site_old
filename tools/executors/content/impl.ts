import * as fs from 'fs';
import * as path from 'path';
import { ExecutorContext } from '@nrwl/devkit';
import { download, extract } from 'gitly';
import { clean, parser } from './parser/parser';
import rimraf from 'rimraf';
import { log } from './internal/log';
import { EntitiesIndex } from './internal/EntitiesIndex';
import { Storage } from './internal/Storage';
import { IFullIndex } from '../../../types/IFullIndex';
import { IEventEntity, IPersonEntity } from '../../../types/entities';
import { PersonEntity } from './internal/PersonEntity';
import { createEntity } from './internal/entityFactory';
import { EntitiesTimeline } from './internal/EntitiesTimeline';
import { EventEntity } from './internal/EventEntity';
import { Timeline } from '../../../types/Timeline';

export interface IContentExecutorOptions {
  repository: string;
}

export default async function contentExecutor(options: IContentExecutorOptions, context: ExecutorContext) {
  // Очистим всю мета-информацию
  rimraf.sync('./apps/jewishhistory.info/pages/content/*.json');
  log.success('Cleaning content directory', 'success');

  // Клонируем репозиторий с контентом
  const source = await download(options.repository);
  const contentDir = await extract(source, './apps/jewishhistory.info/pages/content');
  const isSuccessDownload = Boolean(contentDir);
  if (!isSuccessDownload) {
    return { success: false };
  }

  log.success('Downloading content', 'success');

  const index = new EntitiesIndex(new Storage<IFullIndex>(contentDir, 'index.json'));
  index.init();

  const files = fs.readdirSync(contentDir)
    .filter((f) => f.match(/.md$/));

  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), { encoding: 'utf8' });
    const fields = parser(file, content);

    fs.writeFileSync(path.join(contentDir, file), clean(content));

    index.add(fields.type, { code: fields.code, name: fields.name });

    const entity = createEntity(fields, contentDir);
    entity.update(fields as any);

    if (fields.type === 'event') {
      for (const code of fields.persons) {
        const person = new PersonEntity(new Storage<IPersonEntity>(contentDir, `${code}.json`));
        person.addEvent(fields.code);
      }
    }
  }

  log.success('Parse meta', 'success');

  const actualIndex = index.getIndex();
  const timeline = new EntitiesTimeline(new Storage<Timeline>(contentDir, 'timeline.json'));

  timeline.initFromIndex(actualIndex);

  for (const item of actualIndex.person) {
    const person = new PersonEntity(new Storage<IPersonEntity>(contentDir, `${item.code}.json`));
    timeline.addPerson(person);
  }

  for (const item of actualIndex.event) {
    const event = new EventEntity(new Storage<IEventEntity>(contentDir, `${item.code}.json`));
    timeline.addEvent(event);
  }

  log.success('Build timeline', 'success');

  return {success: true};
}
