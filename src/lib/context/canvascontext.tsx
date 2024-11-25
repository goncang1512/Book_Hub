"use client";
import * as React from "react";
import { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import instance from "../utils/fetch";
import { logger } from "../utils/logger";
import { CanvasProvider } from "../utils/types/provider.type";
import supabase from "../config/supabase";

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
        logger.error(`${error}`);
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
        logger.error(`${error}`);
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
      logger.error(`${error}`);
      setLdlDeleteCanvas(false);
    }
  };

  const maxSize = 50 * 1024 * 1024;
  const [ldlAudio, setLdlAudio] = useState(false);
  const uploadAudio = async (
    canvas_id: string,
    dataAudio: { audio: File | null; size: number; type: string; name: string },
    setAudioSrc: React.Dispatch<React.SetStateAction<any>>,
    setDataAudio: React.Dispatch<
      React.SetStateAction<{ type: string; size: number; audio: File | null; name: string }>
    >,
    fileInputRef: React.MutableRefObject<HTMLInputElement | null>,
  ) => {
    try {
      if (dataAudio.size > maxSize) {
        alert("File terlalu besar! Maksimal ukuran file adalah 50MB.");
        throw new Error("File terlalu besar! Maksimal ukuran file adalah 50MB.");
      }

      if (!dataAudio.audio) {
        throw new Error("No audio file selected");
      }
      setLdlAudio(true);

      const fileExtension = dataAudio.name.split(".").pop()?.toLowerCase();

      const { data, error } = await supabase.storage
        .from("bookarcade-audio")
        .upload(`audio_${Date.now()}.${fileExtension}`, dataAudio.audio);

      if (error) {
        throw error;
      }

      let res;
      if (data) {
        const filePath = data.path;
        const { data: publicUrlData } = supabase.storage
          .from("bookarcade-audio")
          .getPublicUrl(filePath);
        res = await instance.post(`/api/read/audio/${canvas_id}`, {
          public_id: data.path,
          secure_url: publicUrlData.publicUrl,
        });
      }

      if (res?.data.status) {
        setLdlAudio(false);
        setAudioSrc(null);
        setDataAudio({
          type: "",
          size: 0,
          audio: null,
          name: "",
        });
        if (fileInputRef?.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      setLdlAudio(false);
      logger.error("Failed upload audio cerpen");
    }
  };

  const updateAudio = async (
    canvas_id: string,
    dataAudio: { audio: File | null; size: number; type: string; name: string },
    setAudioSrc: React.Dispatch<React.SetStateAction<any>>,
    setDataAudio: React.Dispatch<
      React.SetStateAction<{ type: string; size: number; audio: File | null; name: string }>
    >,
    fileInputRef: React.MutableRefObject<HTMLInputElement | null>,
  ) => {
    try {
      if (dataAudio.size > maxSize) {
        alert("File terlalu besar! Maksimal ukuran file adalah 50MB.");
        throw new Error("File terlalu besar! Maksimal ukuran file adalah 50MB.");
      }

      if (!dataAudio.audio) {
        throw new Error("No audio file selected");
      }
      setLdlAudio(true);

      const fileExtension = dataAudio.name.split(".").pop()?.toLowerCase();

      const { data, error } = await supabase.storage
        .from("bookarcade-audio")
        .upload(`audio_${Date.now()}.${fileExtension}`, dataAudio.audio);

      if (error) {
        throw error;
      }

      let res;
      if (data) {
        const { data: publicUrlData } = supabase.storage
          .from("bookarcade-audio")
          .getPublicUrl(data.path);

        res = await instance.patch(`/api/read/audio/${canvas_id}`, {
          public_id: data.path,
          secure_url: publicUrlData.publicUrl,
        });
      }

      if (res?.data.status) {
        setLdlAudio(false);
        setAudioSrc(null);
        setDataAudio({
          type: "",
          size: 0,
          audio: null,
          name: "",
        });
        if (fileInputRef?.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      setLdlAudio(false);
      logger.error("Failed upload audio cerpen");
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
        uploadAudio,
        updateAudio,
        ldlAudio,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}
