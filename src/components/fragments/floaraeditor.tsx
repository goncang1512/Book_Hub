import React, { SetStateAction } from "react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/plugins/fullscreen.min.css";

import dynamic from "next/dynamic";

const FroalaEditorComponent = dynamic(
  async () => {
    const result = await Promise.all([
      import("react-froala-wysiwyg"),
      // @ts-ignore
      import("froala-editor/js/plugins.pkgd.min.js"),
      // @ts-ignore
      import("froala-editor/js/plugins.pkgd.min.js"),
      // @ts-ignore
      import("froala-editor/js/plugins/fullscreen.min.js"),
      // @ts-ignore
      import("froala-editor/js/plugins/link.min.js"),
      // @ts-ignore
      import("froala-editor/js/plugins/align.min.js"),
    ]);

    return result[0];
  },
  {
    ssr: false,
  },
);

export const FloaraEdtor = ({
  floara,
  setFloara,
}: {
  floara: string;
  setFloara: React.Dispatch<SetStateAction<string>>;
}) => {
  const handleModelChange = (event: any) => {
    setFloara(event);
  };

  const config = {
    toolbarInline: false,
    placeholderText: "Isi pesan...",
    toolbarButtons: [
      "fullscreen",
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "subscript",
      "superscript",
      "fontFamily",
      "fontSize",
      "textColor",
      "backgroundColor",
      "inlineClass",
      "inlineStyle",
      "clearFormatting",
      "insertLink",
      "align",
    ],
    fontSize: ["8", "10", "12", "14", "18", "30", "60", "96"],
  };

  return (
    <div style={{ height: "300px", overflowY: "auto" }}>
      <FroalaEditorComponent
        config={config}
        model={floara}
        tag="textarea"
        onModelChange={handleModelChange}
      />
    </div>
  );
};
