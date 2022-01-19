import * as YAML from 'yaml';
import { Entity } from '../../../../types/entities';
import { HDate, months } from '@hebcal/core';

export function parser(filename: string, content: string): Entity {
  const [matched] = content.match(/---\n([.\S\s]+)---/g);
  const frontmatter = matched.replace(/-{3}/g, '');
  const entity = YAML.parse(frontmatter);

  entity.code = filename.replace('.md', '');

  if (entity.type === 'event') {
    entity.persons = entity.persons || [];
    // TODO: валидация
    const [day, month, year] = entity.date_start.split('-');
    entity.date_start = new HDate(day, month, year).abs();
  }

  return entity;
}

export function clean(content: string) {
  return content.replace(/(---\n[.\S\s]+---)/g, '');
}
