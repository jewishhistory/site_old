import { Storage } from './Storage';
import { ITimelineItem, Timeline } from '../../../../types/Timeline';
import { IFullIndex } from '../../../../types/IFullIndex';
import { PersonEntity } from './PersonEntity';
import { EventEntity } from './EventEntity';

export class EntitiesTimeline {
  constructor(private _storage: Storage<Timeline>) {
  }

  initFromIndex(index: IFullIndex) {
    const initial = index.era.reduce<Timeline>((acc, current) => [
      ...acc,
      { ...current, events: [], persons: [] }
    ], []);
    this._storage.setData(initial);
  }

  addPerson(person: PersonEntity) {
    const timeline = this._storage.getData();
    const personFields = person.getData();
    const era = timeline.find(e => e.code === personFields.era);
    if (era) {
      era.persons.push({ code: personFields.code, name: personFields.name });
      this._storage.setData(timeline);
    }
  }

  addEvent(event: EventEntity) {
    const timeline = this._storage.getData();
    const eventFields = event.getData();
    const era = timeline.find(e => e.code === eventFields.era);
    if (era) {
      era.events.push({ code: eventFields.code, name: eventFields.name, dateStart: eventFields.date_start });
      // Отсортируем события в порядке возрастания
      era.events.sort((src, dest) => src.dateStart - dest.dateStart);
      // Отсортируем эпохи в порядке возрастания по первому событию в эпохе
      timeline.sort((src, dest) => (src.events[0] || { dateStart: 0 }).dateStart - (dest.events[0] || { dateStart: 0 }).dateStart);
      this._storage.setData(timeline);
    }
  }
}
