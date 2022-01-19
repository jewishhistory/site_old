import { Storage } from './Storage';
import { IFullIndex } from '../../../../types/IFullIndex';
import { IBaseEntity } from '../../../../types/entities';

export class EntitiesIndex {
  constructor(private _storage: Storage<IFullIndex>) {
  }

  init() {
    this._storage.setData({
      era: [],
      person: [],
      event: [],
    });
  }

  getIndex() {
    return this._storage.getData();
  }

  addEra(era: IBaseEntity) {
    this.add('era', era);
  }

  addPerson(person: IBaseEntity) {
    this.add('person', person);
  }

  addEvent(event: IBaseEntity) {
    this.add('event', event);
  }

  add(type: keyof IFullIndex, entity: IBaseEntity) {
    const data = this._storage.getData();
    data[type].push(entity);
    data[type].sort((src, dest) => src.name.localeCompare(dest.name));
    this._storage.setData(data);
  }
}
