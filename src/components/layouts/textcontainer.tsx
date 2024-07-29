"use client";
import React, { SetStateAction, useMemo, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { extractText } from "@/lib/utils/extractText";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function TextContainer({
  content,
  setContent,
  setWordCount,
}: {
  content: string;
  setContent: React.Dispatch<SetStateAction<string>>;
  setWordCount: React.Dispatch<SetStateAction<number>>;
}) {
  const [editorHeight, setEditorHeight] = useState<string>("92vh");
  const joditButtons = [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "ul",
    "ol",
    "outdent",
    "indent",
    "align",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "undo",
    "redo",
    "hr",
    "eraser",
    "fullsize",
    "cut",
    "copy",
    "paste",
    "superscript",
    "subscript",
  ];

  const config = useMemo(
    () => ({
      placeholder: "Tambahkan cerita...",
      height: editorHeight,
      buttons: joditButtons,
      askBeforePasteHTML: false,
      cleanHTML: {
        allowedTags: ["p", "strong", "em", "u", "s", "ul", "ol", "li"],
        allowedAttrs: [],
      },
    }),
    [joditButtons, editorHeight],
  );

  const countWords = (text: string) => {
    const cleanedText = extractText(text);
    const wordsArray = cleanedText.trim().split(/\s+/);
    return wordsArray.length;
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setWordCount(countWords(newContent));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window?.innerWidth > 674) {
        setEditorHeight("91.5vh");
      } else {
        setEditorHeight("84vh");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col">
      <JoditEditor
        config={config}
        value={content}
        onBlur={(newContent) => handleContentChange(newContent)}
      />
    </div>
  );
}
