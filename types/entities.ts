export interface IBaseEntity {
  name: string;
  code: string;
}

export interface IEraEntity extends IBaseEntity {
  type: 'era';
  persons: string[];
  events: string[];
}

export interface IPersonEntity extends IBaseEntity {
  type: 'person';
  era: string;
  events: string[];
}

export interface IEventEntity extends IBaseEntity {
  type: 'event';
  era: string;
  persons: string[];
  date_start: number;
}

export type Entity = IEraEntity | IPersonEntity | IEventEntity;
