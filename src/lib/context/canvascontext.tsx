"use client";
import * as React from "react";
import { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import instance from "../utils/fetch";
import { logger } from "../utils/logger";
import { CanvasProvider } from "../utils/types/provider.type";

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

  const uploadAudioToCloudinary = async (audioFile: File | null) => {
    if (!audioFile) throw Error("Tidak ada file audio");
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("upload_preset", `${process.env.NEXT_PUBLIC_CLOUD_PRESET}`);
    formData.append("folder", "audio");
    formData.append("resource_type", "video");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();
    return data;
  };

  const [ldlAudio, setLdlAudio] = useState(false);
  const uploadAudio = async (
    canvas_id: string,
    dataAudio: { audio: File | null; size: number; type: string },
    setAudioSrc: React.Dispatch<React.SetStateAction<any>>,
    setDataAudio: React.Dispatch<
      React.SetStateAction<{ type: string; size: number; audio: File | null }>
    >,
    fileInputRef: React.MutableRefObject<HTMLInputElement | null>,
  ) => {
    if (!dataAudio.audio) {
      throw new Error("No audio file selected");
    }
    try {
      setLdlAudio(true);

      const audio: any = await uploadAudioToCloudinary(dataAudio.audio);

      const formData = new FormData();
      formData.append("public_id", audio?.public_id);
      formData.append("secure_url", audio?.secure_url);

      const res = await instance.post(`/api/read/audio/${canvas_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      });

      if (res.data.status) {
        setLdlAudio(false);
        setAudioSrc(null);
        setDataAudio({
          type: "",
          size: 0,
          audio: null,
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
    dataAudio: { audio: File | null; size: number; type: string },
    setAudioSrc: React.Dispatch<React.SetStateAction<any>>,
    setDataAudio: React.Dispatch<
      React.SetStateAction<{ type: string; size: number; audio: File | null }>
    >,
    fileInputRef: React.MutableRefObject<HTMLInputElement | null>,
  ) => {
    if (!dataAudio.audio) {
      throw new Error("No audio file selected");
    }

    try {
      if (dataAudio.size > 10 * 1024 * 1024) {
        throw new Error("Ukuran file maksimal 10mb");
      }
      setLdlAudio(true);

      const audio: any = await uploadAudioToCloudinary(dataAudio.audio);

      const formData = new FormData();
      formData.append("public_id", audio?.public_id);
      formData.append("secure_url", audio?.secure_url);

      const res = await instance.patch(`/api/read/audio/${canvas_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      });

      if (res.data.status) {
        setLdlAudio(false);
        setAudioSrc(null);
        setDataAudio({
          type: "",
          size: 0,
          audio: null,
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
