"use client";
import * as React from "react";
import { IoIosClose } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import TextContainer from "@/components/layouts/textcontainer";
import { Button } from "@/components/elements/button";
import { Input } from "@/components/elements/input";
import { useChapter } from "@/lib/utils/useSwr";
import { CanvasContext } from "@/lib/context/canvascontext";
import { extractText } from "@/lib/utils/extractText";

const countWord = (text: string) => {
  const teks = text.trim().split(/\s+/);
  return teks.length;
};

export default function TextEditor() {
  const searchParams = useSearchParams();
  const id: any = searchParams.get("id");
  const chapter: any = searchParams.get("c");
  const { bacaBuku, bacaBukuLoading } = useChapter.readBook(id && id, chapter && chapter);
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setContent(extractText(bacaBuku?.story));
    setWordCount(countWord(extractText(bacaBuku?.story)));
  }, [bacaBuku]);

  if (bacaBukuLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loading loading-bars loading-md" />
      </div>
    );
  }

  return (
    <div className="">
      <div>
        <TextContainer content={content} setContent={setContent} setWordCount={setWordCount} />
        <div className="p-2 flex justify-end">
          <button
            className="border p-2 bg-green-400 rounded-lg"
            type="submit"
            onClick={() => {
              const modal = document.getElementById("modal_add_chapter") as HTMLDialogElement;
              modal.showModal();
            }}
          >
            Update Chapter
          </button>
        </div>
      </div>
      <ModalAddChapter
        bacaBuku={bacaBuku}
        book_id={id && id}
        content={content}
        setContent={setContent}
        story_id={bacaBuku?._id}
        wordCount={wordCount}
      />
    </div>
  );
}

const ModalAddChapter = ({
  book_id,
  content,
  setContent,
  wordCount,
  story_id,
  bacaBuku,
}: {
  book_id: string;
  content: string;
  wordCount: number;
  story_id: string;
  bacaBuku: { judul: string; chapter: string; status: string };
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { handleSubmitUpdate, msgChapter, chapterUpData, setChapterUpData, loadingCanvas } =
    useContext(CanvasContext);

  useEffect(() => {
    setChapterUpData({
      ...chapterUpData,
      judul: bacaBuku?.judul,
      chapter: bacaBuku?.chapter,
      status: bacaBuku?.status,
    });
  }, [bacaBuku?.judul, bacaBuku?.chapter, bacaBuku?.status]);

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
          className="flex flex-col gap-4 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitUpdate(book_id, chapterUpData, content, wordCount, story_id, setContent);
          }}
        >
          <Input
            container="labelFloat"
            name="judul"
            type="text"
            value={chapterUpData.judul}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setChapterUpData({ ...chapterUpData, judul: e.target.value })}
          >
            Judul
          </Input>
          <Input
            container="labelFloat"
            name="judul"
            type="number"
            value={chapterUpData.chapter}
            varLabel="labelFloat"
            variant="labelFloat"
            onChange={(e) => setChapterUpData({ ...chapterUpData, chapter: e.target.value })}
          >
            Chapter
          </Input>
          <select
            className={`flex select select-bordered w-full`}
            value={chapterUpData.status}
            onChange={(e) => {
              setChapterUpData({ ...chapterUpData, status: e.target.value });
            }}
          >
            <option disabled className="bg-blue-400 text-white" value="Jenis Buku">
              Status
            </option>
            <option value="Submitted">Submit</option>
            <option value="Draft">Draft</option>
          </select>
          <Button disabled={loadingCanvas} type="submit" variant="primary">
            {loadingCanvas ? "Loading..." : "Update Chapter"}
          </Button>
        </form>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button>close</button>
      </form>
    </dialog>
  );
};
