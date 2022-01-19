import { bold, bgGreenBright, bgRedBright, greenBright, redBright, black } from 'colorette';

export const log = {
  success: (title: string, message: string) =>
    console.log(greenBright(' >'), bold(bgGreenBright(black(` ${title.toUpperCase()} `))), greenBright(message)),
  error: (title: string, message: string) =>
    console.log(redBright(' >'), bold(bgRedBright(black(` ${title.toUpperCase()} `))), redBright(message)),
};
