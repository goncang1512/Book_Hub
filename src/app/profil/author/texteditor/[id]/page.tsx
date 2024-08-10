"use client";
import * as React from "react";
import { IoIosClose } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import JoditText from "@/components/fragments/JoditEditor";
import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { CanvasContext } from "@/lib/context/canvascontext";
import { extractText, useResponsiveValue } from "@/lib/utils/extractText";

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

const countWord = (text: string) => {
  const teks = text.trim().split(/\s+/);
  return teks.length;
};

export default function TextEditor({ params }: { params: { id: string } }) {
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (content) {
      setWordCount(countWord(extractText(content)));
    }
  }, [content]);

  const height = useResponsiveValue({
    widthBreakpoint: 768,
    mobileValue: "84vh",
    desktopValue: "92vh",
  });

  return (
    <div className="">
      <div>
        <JoditText
          content={content}
          height={height}
          joditButtons={joditButtons}
          setContent={setContent}
        />
        <div className="p-2 flex justify-end">
          <button
            className="border p-2 bg-green-400 rounded-lg"
            type="submit"
            onClick={() => {
              const modal = document.getElementById("modal_add_chapter") as HTMLDialogElement;
              modal.showModal();
            }}
          >
            Tambahkan Chapter
          </button>
        </div>
      </div>
      <ModalAddChapter
        book_id={params.id}
        content={content}
        setContent={setContent}
        wordCount={wordCount}
      />
    </div>
  );
}

const ModalAddChapter = ({
  content,
  book_id,
  setContent,
  wordCount,
}: {
  content: string;
  book_id: string;
  wordCount: number;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { msgChapter, chapterData, setChapterData, loadingCanvas, handleSubmit } =
    useContext(CanvasContext);
  const { data: session }: any = useSession();

  return (
    <dialog className="modal" id="modal_add_chapter">
      <div className="relative modal-box">
        <button
          className="absolute top-2 right-2 active:bg-gray-300 rounded-full"
          onClick={() => {
            const modal = document.getElementById("modal_add_chapter") as HTMLDialogElement;
            modal.close();
          }}
        >
          <IoIosClose size={30} />
        </button>
        <p className="text-sm italic text-red-500 text-center">{msgChapter}</p>
        <form
          className="flex flex-col gap-3 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(session?.user?._id, book_id, content, wordCount, chapterData, setContent);
          }}
        >
          <Input
            container="labelFloat"
            name="judul"
            type="text"
            value={chapterData?.judul}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setChapterData({ ...chapterData, judul: e.target.value })}
          >
            Judul
          </Input>
          <Input
            container="labelFloat"
            name="judul"
            type="number"
            value={chapterData?.chapter}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setChapterData({ ...chapterData, chapter: e.target.value })}
          >
            Chapter
          </Input>
          <select
            className={`flex select select-bordered w-full`}
            value={chapterData.status}
            onChange={(e) => {
              setChapterData({ ...chapterData, status: e.target.value });
            }}
          >
            <option disabled className="bg-blue-400 text-white" value="Jenis Buku">
              Status
            </option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submit</option>
          </select>
          <Button disabled={loadingCanvas} type="submit" variant="primary">
            {loadingCanvas ? "Loading..." : "Add Chapter"}
          </Button>
        </form>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button>close</button>
      </form>
    </dialog>
  );
};
