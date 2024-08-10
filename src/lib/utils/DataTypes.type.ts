/* eslint-disable no-unused-vars */
import { dataUserType } from "@/components/fragments/baristable";
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

export interface RegisterType {
  username: string;
  email: string;
  password: string;
  confpassword: string;
  codeOtp: string;
  id_register: string;
}

export interface UpdateType {
  username: string;
  number: string;
  email: string;
  alamat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
}

export type UpdateFoto = {
  oldId: string;
  size: number;
  type: string;
  img: string;
};

export interface UserContextType {
  loadingRegister: boolean;
  messageRegister: string;
  dataRegister: RegisterType;
  setDataRegister: React.Dispatch<React.SetStateAction<RegisterType>>;
  registerUser: (body: RegisterType) => void;
  updateUsername: (id: string, body: UpdateType) => void;
  updateData: UpdateType;
  setUpdateData: React.Dispatch<React.SetStateAction<UpdateType>>;
  updateFoto: UpdateFoto | null;
  setUpdateFoto: React.Dispatch<React.SetStateAction<UpdateFoto | null>>;
  loadingUpdateFoto: boolean;
  setLoadingUpdateFoto: React.Dispatch<React.SetStateAction<boolean>>;
  newFotoProfil: (id: string, body: any) => void;
  deleteFoto: (id: string, idFoto: string) => void;
  loadingDelete: boolean;
  setLoadingDelete: React.Dispatch<React.SetStateAction<boolean>>;
  loadingUpdateData: boolean;
  messageNewFoto: string;
  deleteAccount: (id: string) => void;
  setMessageRegister: any;
  msgUpdateData: string;
  nextPassword: boolean;
  loadingPassword: boolean;
  msgPassword: string;
  password: {
    oldPassword: string;
    newPassword: string;
    confNewPassword: string;
  };
  setPassword: React.Dispatch<
    React.SetStateAction<{
      oldPassword: string;
      newPassword: string;
      confNewPassword: string;
    }>
  >;
  kirimPassword: (email: string, oldPassword: string) => void;
  updatePassword: (id: string, newPassword: string, confNewPassword: string) => void;
  patchBadge: (id_user: string, badge: string[]) => void;
  ldlPatchBadge: boolean;
}

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

// StoryContext
export interface StoryInterface {
  dataContent: string;
  setDataContent: React.Dispatch<React.SetStateAction<string>>;
  loadingUploadStory: boolean;
  uploadStory: (body: any, id: string, bookId: string) => void;
  deletedStory: (id: string, bookId: string) => void;
  loadingDeleteStory: boolean;
  newCeption: string;
  setNewCeption: React.Dispatch<React.SetStateAction<string>>;
  updateStory: (ception: string, id: string) => Promise<boolean>;
  loadingUpdateStory: boolean;
  msgUpdateCerita: string;
  msgRank: { experience: number; level: number; point: number };
  msgUploadCerita: string;
  msgLvlUp: LvlUpType;
  setMsgLvlUp: React.Dispatch<React.SetStateAction<LvlUpType>>;
}

export type LvlUpType = {
  level: number;
  experience: number;
  lvlUp: { status: boolean; message: string };
};

// Dasboard context
export type EditStatus = {
  status: string;
  message: string;
  senderId: string;
  recipientId: string;
};

export interface DasboardProps {
  updateRole: (user_id: string, email: string, role: string) => void;
  searchUser: (keyword: string) => void;
  keyword: string;
  setKeyWord: React.Dispatch<SetStateAction<string>>;
  dataUser: dataUserType | null;
  msgSearchUser: {
    status: boolean;
    message: string;
  };
  updateCanvas: (id: string, editStatus: EditStatus, setNewDataChapter: any) => void;
}
