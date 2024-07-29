import * as cheerio from "cheerio";

export const extractText = (htmlString: string): string => {
  const $ = cheerio.load(htmlString);
  return $("body").text(); // Mengambil teks dari seluruh body
};
