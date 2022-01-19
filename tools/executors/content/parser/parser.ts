import * as YAML from 'yaml';
import { Entity } from '../../../../types/entities';

export function parser(filename: string, content: string): Entity {
  const [matched] = content.match(/---\n([.\S\s]+)---/g);
  const frontmatter = matched.replace(/-{3}/g, '');
  const entity = YAML.parse(frontmatter);

  entity.code = filename.replace('.md', '');

  if (entity.type === 'event') {
    entity.persons = entity.persons || [];
  }

  return entity;
}

export function clean(content: string) {
  return content.replace(/(---\n[.\S\s]+---)/g, '');
}
