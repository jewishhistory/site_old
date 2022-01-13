import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as child_process from 'child_process';
import { ExecutorContext } from '@nrwl/devkit';
import { download, extract } from 'gitly';
import { merge } from 'lodash';
import { bold, bgGreenBright, bgRedBright, greenBright, redBright, black } from 'colorette';
import { parse } from './parser/parse';

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
  const { stderr } = await exec('rm -rf ./content');

  if (stderr) {
    return { success: false };
  }

  log.success('Cleaning content directory', 'success');

  const source = await download(options.repository);
  const contentDir = await extract(source, './content');
  const isSuccessDownload = Boolean(contentDir);
  if (!isSuccessDownload) {
    return { success: false };
  }

  log.success('Downloading content', 'success');

  const files = fs.readdirSync(contentDir)
    .filter((f) => f.match(/.md$/));

  for (const file of files) {
    const content = fs.readFileSync(path.join(contentDir, file), { encoding: 'utf8' });
    const entity = parse(content);

    const filename = path.join(contentDir, `${entity.code}.json`);

    (entity as any).path = path.join(contentDir, file);

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

  return {success: true};
}
