"use client";
import React, { useEffect, useState } from "react";

type ReadMoreType = {
  text: string | null;
  maxLength: number;
  textFont: string;
  other: boolean;
  mobile?: number;
  style?: Record<string, any>;
};

const ReadMoreLess = ({ text, maxLength, mobile, textFont, other, style }: ReadMoreType) => {
  const [isFullTextShown, setIsFullTextShown] = useState(false);
  const toggleShowText = () => {
    setIsFullTextShown(!isFullTextShown);
  };
  const [windowSize, setWindowSize] = useState<any>({
    width: undefined,
    height: undefined,
  });
  const paragraphs = text && text.split("\n");

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window?.innerWidth,
        height: window?.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const panjangTeks = windowSize.width > 640 ? maxLength : (mobile ?? maxLength);
  return (
    <div>
      {isFullTextShown ? (
        <div className={textFont} style={style}>
          {paragraphs &&
            paragraphs.map((text: string, index) => <p key={index}>{text || "\u00A0"}</p>)}
          <button className="cursor-pointer text-gray-400" onClick={toggleShowText}>
            {" "}
            hide
          </button>
        </div>
      ) : (
        <p className={textFont} style={style}>
          {text && text.slice(0, panjangTeks)}
          {text && text.length > panjangTeks && (
            <button onClick={toggleShowText}>
              <span className="cursor-pointer text-gray-400">{other ? " ...see more" : "..."}</span>
            </button>
          )}
        </p>
      )}
    </div>
  );
};

export const SpoilerText = ({ children }: { children: string }) => {
  const [isHovered, setIsHovered] = useState(true);
  const isSpoiler =
    typeof children === "string" && children.startsWith("||") && children.endsWith("||");

  const spoilerText = isSpoiler ? children.substring(2, children.length - 2) : children;

  const paragraphs = spoilerText && spoilerText.split("\n");
  return (
    <div>
      <p className="text-red-500 italic">spoiler alert</p>
      {paragraphs &&
        paragraphs.map((text: string, index) => {
          return (
            <p key={index}>
              <span
                className={`${
                  isHovered
                    ? `${text && "bg-[#6b7280] text-transparent"}`
                    : `${text && "text-inherit bg-[#e8e8e8]"}`
                } md:text-base text-sm`}
                onMouseEnter={() => setIsHovered(false)}
                onMouseLeave={() => setIsHovered(true)}
              >
                {text || "\u00A0"}
              </span>
            </p>
          );
        })}
    </div>
  );
};

export default ReadMoreLess;
