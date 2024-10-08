import React, { SetStateAction, useContext, useMemo } from "react";
import dynamic from "next/dynamic";
import { GlobalState } from "@/lib/context/globalstate";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function JoditText({
  joditButtons,
  content,
  setContent,
  height,
  width,
  edit,
}: {
  joditButtons: string[];
  content: string;
  setContent: React.Dispatch<SetStateAction<string>>;
  height: string;
  width?: string;
  edit?: boolean;
}) {
  const { isDarkMode } = useContext(GlobalState);

  const config = useMemo(
    () => ({
      placeholder: "Tambahkan cerita...",
      buttons: joditButtons,
      height: height,
      width: width,
      askBeforePasteHTML: false,
      removeButtons: ["microphone"],
      extraButtons: [],
      toolbarSticky: false,
      toolbarAdaptive: true,
      cleanHTML: {
        allowedTags: ["p", "strong", "em", "u", "s", "ul", "ol", "li"],
        allowedAttrs: ["href"],
      },
      theme: isDarkMode ? "dark" : "",
      style: {
        background: isDarkMode ? "#171717" : "#ffffff", // Dark mode or light mode
        color: isDarkMode ? "#ffffff" : "#000000", // Teks warna berdasarkan mode
      },
    }),
    [joditButtons],
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <>
      {edit ? (
        content !== "" ? (
          <JoditEditor
            config={config}
            value={content}
            onBlur={(newContent) => handleContentChange(newContent)}
          />
        ) : (
          <div className="flex items-center justify-center h-screen w-full">
            <span className="loading loading-dots loading-md" />
          </div>
        )
      ) : (
        <JoditEditor
          config={config}
          value={content}
          onBlur={(newContent) => handleContentChange(newContent)}
        />
      )}
    </>
  );
}
