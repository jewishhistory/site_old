import * as YAML from 'yaml';

interface IPerson {
  type: 'person';
  name: string;
  code: string;
  era: string;
}

interface IEra {
  type: 'era';
  code: string;
  name: string;
}

interface IEvent {
  type: 'event';
  name: string;
  code: string;
  era: string;
  persons: string[];
}

type Entity = IPerson | IEra | IEvent;

export function parse(content: string): Entity {
  const [matched] = content.match(/---\n([.\S\s]+)---/g);
  const frontmatter = matched.replace(/-+/g, '');
  const entity = YAML.parse(frontmatter);

  if (entity.type === 'event') {
    entity.persons = entity.persons ? entity.persons.split(' ') : [];
  }

  return entity;
}
