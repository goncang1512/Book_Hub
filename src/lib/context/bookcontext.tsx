import * as React from "react";
import { useState, createContext } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";

import instance from "../utils/fetch";
import { BookProvider, UploadBookType, UploadMyBookType } from "../utils/DataTypes.type";

export const BookContext = createContext<BookProvider>({} as BookProvider);

export default function BookContextProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUpdate, setPreviewUpdate] = useState<string | null>(null);
  const [loadingBook, setLoadingBook] = useState<boolean>(false);
  const [loadingUpdateBook, setLoadingUpdateBook] = useState<boolean>(false);
  const [msgUploadBook, setMsgUploadBook] = useState<string>("");
  const [bookData, setBookData] = useState<UploadBookType>({
    title: "",
    writer: "",
    sinopsis: "",
    terbit: "",
    ISBN: "",
    genre: [],
    imgBooks: {
      size: 0,
      type: "",
      img: "",
    },
  });

  const [editBook, setEditBook] = useState<UploadBookType>({
    title: "",
    writer: "",
    sinopsis: "",
    terbit: "",
    ISBN: "",
    genre: [],
    imgBooks: {
      size: 0,
      type: "",
      img: "",
    },
  });

  const uploadBook = async (body: UploadBookType, id: string, jenis: string) => {
    const data = { ...body, user_id: id, jenis };
    try {
      setLoadingBook(true);

      const res = await instance.post("/api/book", data);
      if (res.data.status) {
        setPreviewUrl(null);
        setBookData({
          ...bookData,
          title: "",
          writer: "",
          sinopsis: "",
          terbit: "",
          ISBN: "",
          genre: [],
          imgBooks: {
            size: 0,
            type: "",
            img: "",
          },
        });
        setLoadingBook(false);
        router.push("/profil");
      }
    } catch (error: any) {
      if (error.response) {
        setMsgUploadBook(error.response.data.message);
        setTimeout(() => {
          setMsgUploadBook("");
        }, 3000);
      } else {
        console.log(error);
      }
      setLoadingBook(false);
    }
  };

  const deletedBook = async (id: string, user_id: string) => {
    try {
      const res = await instance.delete(`/api/book/${id}`);
      if (res.data.status) {
        mutate(`/api/book`);
        mutate(`/api/book/${user_id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatedBook = async (body: UploadBookType, id: string) => {
    try {
      setLoadingUpdateBook(true);
      const res = await instance.patch(`/api/book/${id}`, body);
      if (res.data.status) {
        setEditBook({
          ...editBook,
          title: "",
          writer: "",
          sinopsis: "",
          terbit: "",
          ISBN: "",
          genre: [],
          imgBooks: {
            size: 0,
            type: "",
            img: "",
          },
        });
        setPreviewUpdate(null);
        setLoadingUpdateBook(false);
        router.back();
      }
    } catch (error) {
      console.log(error);
      setLoadingUpdateBook(false);
    }
  };

  const [myBookData, setMyBookData] = useState<UploadMyBookType>({
    title: "",
    sinopsis: "",
    terbit: "",
    genre: [],
    ISBN: false,
    writer: "",
    jenis: "Novel",
    imgBooks: {
      size: 0,
      type: "",
      img: "",
    },
  });

  const uploadMyBook = async (body: UploadMyBookType, id: string) => {
    const data = { ...body, user_id: id };
    try {
      setLoadingBook(true);

      const res = await instance.post("/api/book", data);
      if (res.data.status) {
        setPreviewUrl(null);
        setMyBookData({
          ...myBookData,
          title: "",
          sinopsis: "",
          terbit: "",
          writer: "",
          ISBN: false,
          genre: [],
          jenis: "Novel",
          imgBooks: {
            size: 0,
            type: "",
            img: "",
          },
        });
        setLoadingBook(false);
        router.push("/profil/author");
      }
    } catch (error: any) {
      if (error.response) {
        setMsgUploadBook(error.response.data.message);
        setTimeout(() => {
          setMsgUploadBook("");
        }, 3000);
      } else {
        console.log(error);
      }
      setLoadingBook(false);
    }
  };

  return (
    <BookContext.Provider
      value={{
        uploadBook,
        previewUrl,
        setPreviewUrl,
        loadingBook,
        bookData,
        setBookData,
        deletedBook,
        loadingUpdateBook,
        editBook,
        setEditBook,
        updatedBook,
        previewUpdate,
        setPreviewUpdate,
        msgUploadBook,
        uploadMyBook,
        myBookData,
        setMyBookData,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}
