import { Storage } from './Storage';
import { IPersonEntity } from '../../../../types/entities';
import { BaseEntity } from './BaseEntity';
import { EraEntity } from './EraEntity';

export class PersonEntity extends BaseEntity<IPersonEntity>{
  constructor(_storage: Storage<IPersonEntity>, private _era?: EraEntity) {
    super(_storage);
  }

  update(entity: Partial<IPersonEntity>) {
    super.update(entity);

    if (this._era) {
      this._era.addPerson(entity.code);
    }
  }

  addEvent(code: string) {
    this.update({ events: [code] });
  }
}
