import { Entity } from 'types/entities';
import path from 'path';
import fs from 'fs';
import markdownIt from 'markdown-it';

export const CONTENT_DIR = './apps/jewishhistory.info/pages/content';

interface IGetDocByFileNameResult {
  slug: string;
  meta: Entity;
  content: string;
}

export function getDocByFileName(filename): IGetDocByFileNameResult {
  const realSlug = filename.replace(/\.md$/, '');
  const fullPath = path.join(CONTENT_DIR, `${realSlug}.md`);
  const metaPath = path.join(CONTENT_DIR, `${realSlug}.json`);
  const content = fs.readFileSync(fullPath, 'utf8');
  const meta = JSON.parse(fs.readFileSync(metaPath, { encoding: 'utf8' }));

  if (meta.persons) {
    meta.persons = meta.persons.map(person => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, `${person}.json`), { encoding: 'utf8' })));
  }

  if (meta.events) {
    meta.events = meta.events.map(event => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, `${event}.json`), { encoding: 'utf8' })));
  }

  return { slug: realSlug, meta, content: markdownIt().renderInline(content) }
}

export const getAllDocs = () => fs.readdirSync(CONTENT_DIR)
  .filter((f) => f.match(/.md$/));
