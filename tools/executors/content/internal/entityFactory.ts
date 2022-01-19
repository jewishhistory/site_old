import { Entity, IEraEntity, IEventEntity, IPersonEntity } from '../../../../types/entities';
import { EraEntity } from './EraEntity';
import { Storage } from './Storage';
import { PersonEntity } from './PersonEntity';
import { EventEntity } from './EventEntity';
import { log } from './log';

export function createEntity(fields: Entity, contentDir: string) {
  switch (fields.type) {
    case 'era':
      return new EraEntity(new Storage<IEraEntity>(contentDir, `${fields.code}.json`));
    case 'person':
      return new PersonEntity(
        new Storage<IPersonEntity>(contentDir, `${fields.code}.json`),
        new EraEntity(new Storage(contentDir, `${fields.era}.json`))
      );
    case 'event':
      return new EventEntity(
        new Storage<IEventEntity>(contentDir, `${fields.code}.json`),
        new EraEntity(new Storage<IEraEntity>(contentDir, `${fields.era}.json`))
      );
    default:
      log.error('createEntity()', 'Неизвестный тип сущности');
      throw new Error('Неизвестный тип сущности');
  }
}
