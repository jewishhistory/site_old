export interface ITimelineEvent {
  name: string;
  code: string;
  dateStart: number;
}

export interface ITimelinePerson {
  name: string;
  code: string;
}

export interface ITimelineItem {
  code: string;
  name: string;
  events: ITimelineEvent[];
  persons: ITimelinePerson[];
}

export type Timeline = Array<ITimelineItem>;
