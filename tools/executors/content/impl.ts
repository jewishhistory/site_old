import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as child_process from 'child_process';
import { ExecutorContext } from '@nrwl/devkit';
import { download, extract } from 'gitly';
import { merge } from 'lodash';
import { bold, bgGreenBright, bgRedBright, greenBright, redBright, black } from 'colorette';
import { clean, parse } from './parser/parse';

const exec = util.promisify(child_process.exec);

const log = {
  success: (title: string, message: string) =>
    console.log(greenBright(' >'), bold(bgGreenBright(black(` ${title.toUpperCase()} `))), greenBright(message)),
  error: (title: string, message: string) =>
    console.log(redBright(' >'), bold(bgRedBright(black(` ${title.toUpperCase()} `))), redBright(message)),
};

export interface IContentExecutorOptions {
  repository: string;
}

export default async function contentExecutor(options: IContentExecutorOptions, context: ExecutorContext) {
  const { stderr } = await exec('rm -rf ./apps/jewishhistory.info/pages/content');

  if (stderr) {
    return { success: false };
  }

  log.success('Cleaning content directory', 'success');

  const source = await download(options.repository);
  const contentDir = await extract(source, './apps/jewishhistory.info/pages/content');
  const isSuccessDownload = Boolean(contentDir);
  if (!isSuccessDownload) {
    return { success: false };
  }

  log.success('Downloading content', 'success');

  const index = {
    era: [],
    person: [],
    event: [],
  };
  const indexFile = path.join(contentDir, 'index.json');
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));

  const files = fs.readdirSync(contentDir)
    .filter((f) => f.match(/.md$/));

  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), { encoding: 'utf8' });
    const entity = parse(content);

    fs.writeFileSync(path.join(contentDir, file), clean(content));

    const filename = path.join(contentDir, `${entity.code}.json`);
    const currentIndex = JSON.parse(fs.readFileSync(indexFile, { encoding: 'utf8' }));
    currentIndex[entity.type].push({ code: entity.code, name: entity.name });
    fs.writeFileSync(indexFile, JSON.stringify(currentIndex, null, 2));

    if (entity.type === 'era') {
      if (fs.existsSync(filename)) {
        const data = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));
        fs.writeFileSync(filename, JSON.stringify(merge({}, data, entity)));
      } else {
        fs.writeFileSync(filename, JSON.stringify(entity, null, 2));
      }
    }

    if (entity.type === 'person') {
      if (fs.existsSync(filename)) {
        const person = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' }));
        fs.writeFileSync(filename, JSON.stringify(merge({}, person, entity), null, 2));
      } else {
        fs.writeFileSync(filename, JSON.stringify(entity, null, 2));
      }
      const eraFileName = path.join(contentDir, `${entity.era}.json`);
      if (fs.existsSync(eraFileName)) {
        const era = JSON.parse(fs.readFileSync(eraFileName, { encoding: 'utf8' }));
        era.persons = era.persons || [];
        era.persons.push(entity.code);
        fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));
      } else {
        const era = { type: 'era', code: entity.era, persons: [entity.code] };
        fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));
      }
    }

    if (entity.type === 'event') {
      fs.writeFileSync(filename, JSON.stringify(entity, null, 2));
      const eraFileName = path.join(contentDir, `${entity.era}.json`);
      if (fs.existsSync(eraFileName)) {
        const era = JSON.parse(fs.readFileSync(eraFileName, { encoding: 'utf8' }));
        era.events = era.events || [];
        era.events.push(entity.code);
        fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));
      } else {
        const era = { type: 'era', code: entity.era, events: [entity.code] };
        fs.writeFileSync(eraFileName, JSON.stringify(era, null, 2));
      }

      for (const person of entity.persons) {
        const personFileName = path.join(contentDir, `${person}.json`);
        if (fs.existsSync(personFileName)) {
          const personObj = JSON.parse(fs.readFileSync(personFileName, { encoding: 'utf8' }));
          personObj.events = personObj.events || [];
          personObj.events.push(entity.code);
          fs.writeFileSync(personFileName, JSON.stringify(personObj, null, 2));
        } else {
          const personObj = { type: 'person', code: person, events: [entity.code] };
          fs.writeFileSync(personFileName, JSON.stringify(personObj, null, 2));
        }
      }
    }
  }

  log.success('Parse meta', 'success');

  const _index = JSON.parse(fs.readFileSync(indexFile, { encoding: 'utf8' }));

  const timelineFile = path.join(contentDir, 'timeline.json');
  const timeline = _index.era.reduce((acc, item) => ({
    ...acc,
    [item.code]: {
      name: item.name,
      events: [],
      persons: [],
    }
  }), {});

  fs.writeFileSync(
    timelineFile,
    JSON.stringify(timeline, null, 2)
  );

  for (const item of _index.person) {
    const timeline = JSON.parse(fs.readFileSync(timelineFile, { encoding: 'utf8' }));
    const person = JSON.parse(fs.readFileSync(path.resolve(contentDir, `${item.code}.json`), { encoding: 'utf8' }));
    timeline[person.era].persons.push({ name: person.name, code: person.code });
    fs.writeFileSync(timelineFile, JSON.stringify(timeline, null, 2));
  }

  for (const item of _index.event) {
    const timeline = JSON.parse(fs.readFileSync(timelineFile, { encoding: 'utf8' }));
    const event = JSON.parse(fs.readFileSync(path.resolve(contentDir, `${item.code}.json`), { encoding: 'utf8' }));
    timeline[event.era].events.push({ name: event.name, code: event.code });
    fs.writeFileSync(timelineFile, JSON.stringify(timeline, null, 2));
  }

  log.success('Build timeline', 'success');

  return {success: true};
}
