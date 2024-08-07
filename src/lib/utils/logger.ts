/* eslint-disable no-console */
const now = new Date();
const date = now.getDate().toString().padStart(2, "0");
const month = (now.getMonth() + 1).toString().padStart(2, "0");
const hours = now.getHours().toString().padStart(2, "0");
const minutes = now.getMinutes().toString().padStart(2, "0");

const formattedDate = `[${date}:${month}:${hours}.${minutes}]`;
const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";
const Reset = "\x1b[0m";
const FgCyan = "\x1b[36m";

export const logger = {
  info: (teks: string) => {
    console.log(`${formattedDate} ${FgGreen}INFO${Reset}: ${FgCyan}${teks}${Reset}`);
  },

  error: (teks: string) => {
    console.log(`${formattedDate} ${FgRed}ERROR${Reset}: ${teks}`);
  },
};
