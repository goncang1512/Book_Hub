/* eslint-disable react/self-closing-comp */
"use client";
import * as React from "react";

import CardProduct from "@/components/layouts/cardproduct";
import TextEditor from "@/components/fragments/JoditEditor";
import { useResponsiveValue } from "@/lib/utils/extractText";

const product = {
  title: "Teruslah Bodoh Jangan Pintar",
  imgProduct:
    "https://res.cloudinary.com/dykunvz4p/image/upload/v1718373198/cover/p80z9op25ihvv15x3o79.jpg",
  description:
    "Galon air sendiri adalah wadah besar berisi air minum yang digunakan untuk memenuhi kebutuhan konsumsi air di rumah atau kantor. Mengutip laman resmi Aqua, jawaban dari pertanyaan Aqua galon berapa liter adalah 19 liter.",
  price: 22000,
  rating: 2.0,
  ongkir: true,
  size: "size-[8rem]",
};

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
  "link",
  "cut",
  "copy",
  "paste",
  "superscript",
  "subscript",
];

export default function Orders() {
  const [content, setContent] = React.useState("");
  return (
    <div className="p-3 flex flex-col gap-2 w-full justify-start">
      <div className="flex flex-wrap gap-2 w-full justify-start">
        {Array.from({ length: 7 }).map((_, index) => (
          <CardProduct
            key={index}
            index={index + 1}
            maxLength={72}
            product={product}
            width="md:w-[24.5%] w-[49.1%]"
          />
        ))}
      </div>
      <TextEditor
        content={content}
        height={useResponsiveValue({
          widthBreakpoint: 768,
          mobileValue: "100vh",
          desktopValue: "92vh",
        })}
        joditButtons={joditButtons}
        setContent={setContent}
      />
    </div>
  );
}
