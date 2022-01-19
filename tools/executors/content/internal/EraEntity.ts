import { IEraEntity, IPersonEntity } from '../../../../types/entities';
import { BaseEntity } from './BaseEntity';

export class EraEntity extends BaseEntity<IEraEntity>{
  addPerson(code: string) {
    this.update({ persons: [code] });
  }

  addEvent(code: string) {
    this.update({ events: [code] });
  }
}
