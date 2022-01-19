import { Storage } from './Storage';
import { mergeWith } from 'lodash';

export class BaseEntity<T> {
  constructor(private _storage: Storage<T>) {
  }

  getData() {
    return this._storage.getData();
  }

  update(entity: Partial<T>) {
    if (this._storage.isExist()) {
      this.merge(entity);
      return;
    }
    this._storage.setData(entity as T);
  }

  private merge(entity: Partial<T>) {
    const current = this._storage.getData();
    const updated = mergeWith({}, current, entity, (obj: unknown, src: unknown) => {
      if (Array.isArray(obj)) {
        return obj.concat(src);
      }
    });
    this._storage.setData(updated);
  }
}
