"use client";
import * as React from "react";
import { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import { CanvasProvider } from "../utils/DataTypes.type";
import instance from "../utils/fetch";

export const CanvasContext = createContext<CanvasProvider>({} as CanvasProvider);

export default function CanvasContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [msgChapter, setMsgChapter] = useState("");
  const [loadingCanvas, setLoadingCanvas] = useState(false);
  const [chapterData, setChapterData] = useState({
    judul: "",
    chapter: "",
    status: "Draft",
  });
  const [chapterUpData, setChapterUpData] = useState({
    judul: "",
    chapter: "",
    status: "",
  });

  const handleSubmitUpdate = async (
    book_id: string,
    chapterUpData: { judul: string; chapter: string; status: string },
    content: string,
    wordCount: number,
    story_id: string,
    setContent: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const data = {
      book_id: book_id,
      story: content,
      judul: chapterUpData.judul,
      chapter: chapterUpData.chapter,
      status: chapterUpData.status,
      wordCount,
    };
    try {
      setLoadingCanvas(true);
      const res = await instance.patch(`/api/read/${story_id}`, data);
      setLoadingCanvas(false);
      setContent("");
      setChapterUpData({
        judul: "",
        chapter: "",
        status: "",
      });

      router.push(`/read/${res?.data.result.book_id}`);
      const modal = document.getElementById("modal_add_chapter") as HTMLDialogElement;
      modal.close();
    } catch (error: any) {
      if (error.response.data) {
        setMsgChapter(error.response.data.message);
        setTimeout(() => {
          setMsgChapter("");
        }, 3000);
      } else {
        console.log(error);
      }
      setLoadingCanvas(false);
    }
  };

  const handleSubmit = async (
    user_id: string,
    book_id: string,
    content: string,
    wordCount: number,
    chapterData: { judul: string; chapter: string; status: string },
    setContent: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const data = {
      user_id,
      book_id,
      story: content,
      status: chapterData.status,
      judul: chapterData.judul,
      chapter: chapterData.chapter,
      wordCount,
    };
    try {
      setLoadingCanvas(true);
      await instance.post(`/api/read`, data);
      setLoadingCanvas(false);
      setContent("");
      setChapterData({
        judul: "",
        chapter: "",
        status: "Draft",
      });
      router.back();
      const modal = document.getElementById("modal_add_chapter") as HTMLDialogElement;
      modal.close();
    } catch (error: any) {
      if (error.response.data) {
        setMsgChapter(error.response.data.message);
        setTimeout(() => {
          setMsgChapter("");
        }, 3000);
      } else {
        console.log(error);
      }
      setLoadingCanvas(false);
    }
  };

  const [ldlDeleteCanvas, setLdlDeleteCanvas] = useState(false);
  const deletedCanvas = async (id: string, book_id: string) => {
    try {
      setLdlDeleteCanvas(true);
      await instance.delete(`/api/read/${id}`);
      setLdlDeleteCanvas(false);
      mutate(`/api/read/detail/${book_id}`);
    } catch (error) {
      console.log(error);
      setLdlDeleteCanvas(false);
    }
  };

  return (
    <CanvasContext.Provider
      value={{
        handleSubmitUpdate,
        msgChapter,
        chapterData,
        setChapterData,
        loadingCanvas,
        handleSubmit,
        ldlDeleteCanvas,
        deletedCanvas,
        chapterUpData,
        setChapterUpData,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}