import * as cheerio from "cheerio";
import { useState, useEffect } from "react";

export const extractText = (htmlString: string): string => {
  const $ = cheerio.load(htmlString);
  return $("body").text(); // Mengambil teks dari seluruh body
};

export function useResponsiveValue({
  widthBreakpoint,
  mobileValue,
  desktopValue,
}: {
  widthBreakpoint: number;
  mobileValue: string;
  desktopValue: string;
}): string {
  const [responsiveValue, setResponsiveValue] = useState<string>(desktopValue);

  useEffect(() => {
    const updateResponsiveValue = () => {
      if (window.innerWidth < widthBreakpoint) {
        setResponsiveValue(mobileValue);
      } else {
        setResponsiveValue(desktopValue);
      }
    };

    updateResponsiveValue();

    window.addEventListener("resize", updateResponsiveValue);

    return () => {
      window.removeEventListener("resize", updateResponsiveValue);
    };
  }, [widthBreakpoint, mobileValue, desktopValue]);

  return responsiveValue;
}
