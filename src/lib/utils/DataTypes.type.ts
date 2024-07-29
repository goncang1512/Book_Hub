import React, { SetStateAction } from "react";

export type UserRegister = {
  username: string;
  email: string;
  password: string;
  confpassword: string;
  codeOtp: string;
};

export type UploadBookType = {
  title: string;
  writer: string;
  sinopsis: string;
  terbit: string;
  ISBN: string;
  genre: string[];
  imgBooks: {
    size: number;
    type: string;
    img: string;
  };
};

export type UploadMyBookType = {
  title: string;
  sinopsis: string;
  terbit: string;
  ISBN: boolean;
  genre: string[];
  jenis: string;
  writer: string;
  imgBooks: {
    size: number;
    type: string;
    img: string;
  };
};

export interface BookProvider {
  uploadBook: (body: UploadBookType, id: string, jenis: string) => void;
  loadingBook: boolean;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  bookData: UploadBookType;
  setBookData: React.Dispatch<React.SetStateAction<UploadBookType>>;
  deletedBook: (id: string, user_id: string) => void;
  loadingUpdateBook: boolean;
  editBook: UploadBookType;
  setEditBook: React.Dispatch<React.SetStateAction<UploadBookType>>;
  updatedBook: (body: UploadBookType, id: string) => void;
  previewUpdate: string | null;
  setPreviewUpdate: React.Dispatch<React.SetStateAction<string | null>>;
  msgUploadBook: string;
  uploadMyBook: (body: UploadMyBookType, id: string) => void;
  myBookData: UploadMyBookType;
  setMyBookData: React.Dispatch<React.SetStateAction<UploadMyBookType>>;
}

export type TypeChapterUpload = {
  user_id: string;
  book_id: string;
  judul: string;
  story: string;
  chapter: string;
  wordCount: number;
};

export interface CanvasProvider {
  chapterData: {
    judul: string;
    chapter: string;
    status: string;
  };
  setChapterData: React.Dispatch<
    SetStateAction<{ judul: string; chapter: string; status: string }>
  >;
  loadingCanvas: boolean;
  msgChapter: string;
  handleSubmitUpdate: (
    book_id: string,
    chapterUpData: { judul: string; chapter: string; status: string },
    content: string,
    wordCount: number,
    story_id: string,
    setContent: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
  handleSubmit: (
    user_id: string,
    book_id: string,
    content: string,
    wordCount: number,
    chapterData: { judul: string; chapter: string; status: string },
    setContent: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
  ldlDeleteCanvas: boolean;
  deletedCanvas: (id: string, book_id: string) => void;
  setChapterUpData: React.Dispatch<
    React.SetStateAction<{ judul: string; chapter: string; status: string }>
  >;
  chapterUpData: { judul: string; chapter: string; status: string };
}

export type UserType = {
  _id: string;
  username: string;
  alamat: string;
  email: string;
  number: string;
  role: string;
  badge: string[];
  imgProfil: {
    imgUrl: string;
    public_id: string;
  };
  rank: {
    experience: number;
    level: number;
    rankNow: string;
    rankTertinggi: {
      img: string;
      no: number;
    };
  };
};
