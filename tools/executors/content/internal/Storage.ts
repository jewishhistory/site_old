import * as fs from 'fs';
import { log } from './log';
import * as path from 'path';

export class Storage<T> {
  constructor(private _folder: string, private _filename: string) {}

  getData(): T {
    try {
      return this.load();
    } catch(e) {
      log.error(`Storage::getData() ${this._filename}`, e.toString());
      throw e;
    }
  }

  setData(data: T) {
    try {
      this.save(data);
    } catch (e) {
      log.error(`Storage::setData() ${this._filename}`, e.toString());
      throw e;
    }
  }

  isExist() {
    return fs.existsSync(this.getPath());
  }

  private load() {
    const raw = fs.readFileSync(this.getPath(), { encoding: 'utf8' });
    return JSON.parse(raw);
  }

  private save(data: unknown) {
    const str = JSON.stringify(data, null, 2);
    fs.writeFileSync(this.getPath(), str);
  }

  private getPath() {
    return path.join(this._folder, this._filename);
  }
}
