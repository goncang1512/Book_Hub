import React, { SetStateAction, useMemo } from "react";
import dynamic from "next/dynamic";
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
      toolbarAdaptive: false,
      cleanHTML: {
        allowedTags: ["p", "strong", "em", "u", "s", "ul", "ol", "li"],
        allowedAttrs: ["href"],
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
