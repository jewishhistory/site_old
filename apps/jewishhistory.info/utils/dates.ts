import { HDate } from '@hebcal/core';

export const displayYear = (year: number) => {
  const hdate = new HDate(year);
  const gregYear = hdate.greg().getUTCFullYear();
  return [
    hdate.getFullYear(),
    year > 0 ? `${Math.abs(gregYear)}г. н.э.` : `${Math.abs(gregYear)}г. до н.э.`,
  ].join(' / ');
};
