import { BaseEntity } from './BaseEntity';
import { IEventEntity, IPersonEntity } from '../../../../types/entities';
import { Storage } from './Storage';
import { EraEntity } from './EraEntity';
import { PersonEntity } from './PersonEntity';

export class EventEntity extends BaseEntity<IEventEntity> {
  constructor(_storage: Storage<IEventEntity>, private _era?: EraEntity) {
    super(_storage);
  }

  update(entity: Partial<IEventEntity>) {
    super.update(entity);
    if (this._era) {
      this._era.addEvent(entity.code);
    }
  }
}
