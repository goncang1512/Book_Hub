/* eslint-disable no-unused-vars */

export type UpUsernameType = {
  username: string;
  number: string;
  email: string;
  alamat: string;
};

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
}

export type UpFotoType = {
  img: string;
  oldId: string;
  size: number;
  type: string;
};

export type UpdateFoto = {
  oldId: string;
  size: number;
  type: string;
  img: string;
};

export type TypeChapterUpload = {
  user_id: string;
  book_id: string;
  judul: string;
  story: string;
  chapter: string;
  wordCount: number;
};

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
