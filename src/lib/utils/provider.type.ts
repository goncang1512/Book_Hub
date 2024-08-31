/* eslint-disable no-unused-vars */
import * as React from "react";
import {
  EditStatus,
  LvlUpType,
  RegisterType,
  UpdateFoto,
  UpdateType,
  UpFotoType,
  UploadBookType,
  UploadMyBookType,
  UserRegister,
} from "./DataTypes.type";
import { BodySendOtp } from "../context/otpcontext";
import { dataUserType } from "@/components/fragments/baristable";
import { MakeReportType } from "../context/reportcontext";

export interface MisiContextType {
  addMisiUser: (user_id: string, mission_id: string, type: string) => void;
  claimMisi: (misiUserId: string, point: number) => void;
  msgPoint: { msg: number; status: boolean; misi_id: string };
}

export interface LikeContextType {
  addLike: (
    user_id: string,
    story_id: string,
    user_story: string,
    book_id: string,
    setLiked: React.Dispatch<React.SetStateAction<boolean>>,
    username: string,
    urlData: string,
    chapterBook?: string | null,
  ) => void;
  disLike: (
    user_id: string,
    story_id: string,
    book_id: string,
    setLiked: React.Dispatch<React.SetStateAction<boolean>>,
    user_story: string,
    username: string,
    urlData: string,
    chapterBook?: string | null,
  ) => void;
  followUser: (
    user_id: string,
    follower_id: string,
    username: string,
    setFollowed: React.Dispatch<React.SetStateAction<boolean>>,
    book_id?: string,
    chapterBook?: string | null,
  ) => void;
  unfollowUser: (
    user_id: string,
    follower_id: string,
    username: string,
    setFollowed: React.Dispatch<React.SetStateAction<boolean>>,
    book_id?: string,
    chapterBook?: string | null,
  ) => void;
}

export interface WhislistContextType {
  addList: (
    user_id: string,
    book_id: string,
    setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
    pagination?: { page: number; limit: number },
    keyword?: string,
  ) => void;
  deleteList: (
    user_id: string,
    book_id: string,
    setIsLiked: React.Dispatch<React.SetStateAction<boolean>>,
    pagination?: { page: number; limit: number },
    keyword?: string,
  ) => void;
  updateHalaman: (book_id: string, halaman: { halaman: string }, user_id: string) => void;
  loadingHalaman: boolean;
}

export interface OtpContextType {
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  setWaktuOTP: React.Dispatch<React.SetStateAction<boolean>>;
  kirimCodeOTP: (body: BodySendOtp) => void;
  updateOtp: (body: UserRegister) => void;
  deletedOtp: (id: string) => void;
  containerInput: boolean;
  seconds: number;
  loadingOTP: boolean;
  waktuOTP: boolean;
}

export interface UserContextType {
  setDataRegister: React.Dispatch<React.SetStateAction<RegisterType>>;
  registerUser: (body: RegisterType) => void;
  updateUsername: (id: string, body: UpdateType) => void;
  setUpdateData: React.Dispatch<React.SetStateAction<UpdateType>>;
  setUpdateFoto: React.Dispatch<React.SetStateAction<UpdateFoto | null>>;
  setLoadingUpdateFoto: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingDelete: React.Dispatch<React.SetStateAction<boolean>>;
  newFotoProfil: (id: string, body: UpFotoType | null) => void;
  deleteFoto: (id: string, idFoto: string) => void;
  deleteAccount: (id: string) => void;
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
  loadingRegister: boolean;
  dataRegister: RegisterType;
  messageRegister: string;
  updateData: UpdateType;
  updateFoto: UpdateFoto | null;
  loadingUpdateFoto: boolean;
  loadingDelete: boolean;
  loadingUpdateData: boolean;
  messageNewFoto: string;
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
  ldlPatchBadge: boolean;
}

// StoryContext
export interface StoryInterface {
  setNewCeption: React.Dispatch<React.SetStateAction<string>>;
  updateStory: (ception: string, id: string, book_id: string, urlData: string) => Promise<boolean>;
  setMsgLvlUp: React.Dispatch<React.SetStateAction<LvlUpType>>;
  setDataContent: React.Dispatch<React.SetStateAction<string>>;
  deletedStory: (id: string, bookId: string, urlData: string) => void;
  uploadStory: (ception: string, id: string, bookId: string, type: string, urlData: string) => void;
  loadingUploadStory: boolean;
  loadingDeleteStory: boolean;
  dataContent: string;
  newCeption: string;
  loadingUpdateStory: boolean;
  msgUpdateCerita: string;
  msgRank: { experience: number; level: number; point: number };
  msgUploadCerita: string;
  msgLvlUp: LvlUpType;
}

export interface CanvasProvider {
  setChapterData: React.Dispatch<
    React.SetStateAction<{ judul: string; chapter: string; status: string }>
  >;
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
  deletedCanvas: (id: string, book_id: string) => void;
  setChapterUpData: React.Dispatch<
    React.SetStateAction<{ judul: string; chapter: string; status: string }>
  >;
  chapterData: {
    judul: string;
    chapter: string;
    status: string;
  };
  loadingCanvas: boolean;
  msgChapter: string;
  ldlDeleteCanvas: boolean;
  chapterUpData: { judul: string; chapter: string; status: string };
}

export interface BookProvider {
  uploadBook: (body: UploadBookType, id: string, jenis: string) => void;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setBookData: React.Dispatch<React.SetStateAction<UploadBookType>>;
  deletedBook: (id: string, user_id: string) => void;
  setEditBook: React.Dispatch<React.SetStateAction<UploadBookType>>;
  updatedBook: (body: UploadBookType, id: string) => void;
  uploadMyBook: (body: UploadMyBookType, id: string) => void;
  setPreviewUpdate: React.Dispatch<React.SetStateAction<string | null>>;
  setMyBookData: React.Dispatch<React.SetStateAction<UploadMyBookType>>;
  loadingBook: boolean;
  previewUrl: string | null;
  bookData: UploadBookType;
  loadingUpdateBook: boolean;
  editBook: UploadBookType;
  previewUpdate: string | null;
  msgUploadBook: string;
  myBookData: UploadMyBookType;
}

export interface AuthContextType {
  login: (body: { email: string; password: string }) => void;
  sendNewEmail: (oldEmail: string, newEmail: string, user_id: string) => void;
  updateEmail: (codeOtp: string, user_id: string) => void;
  setDataLogin: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  setNewEmail: React.Dispatch<React.SetStateAction<string>>;
  setCodeOtp: React.Dispatch<React.SetStateAction<string>>;
  loadingLogin: boolean;
  dataLogin: {
    email: string;
    password: string;
  };
  messageAuth: string;
  trueCode: boolean;
  msgUpdateData: string;
  loadingEmail: boolean;
  newEmail: string;
  codeOtp: string;
}

export interface DasboardProps {
  updateRole: (user_id: string, email: string, role: string) => void;
  searchUser: (keyword: string) => void;
  setKeyWord: React.Dispatch<React.SetStateAction<string>>;
  updateCanvas: (id: string, editStatus: EditStatus, setNewDataChapter: any) => void;
  bannedUser: (user_id: string, status: string) => void;
  keyword: string;
  dataUser: dataUserType | null;
  msgSearchUser: {
    status: boolean;
    message: string;
  };
}

export interface ReportContextType {
  makeReport: (
    { user_id, report, message, from }: MakeReportType,
    setDataReport: React.Dispatch<React.SetStateAction<any | null>>,
  ) => void;
  deleteOneReport: (report_id: string) => void;
  deleted: { report_id: string; status: boolean };
}
