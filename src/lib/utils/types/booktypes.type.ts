export type ReqCreateBook = {
  title: string;
  writer: string;
  sinopsis: string;
  terbit: string;
  imgBooks: {
    size: number;
    type: string;
    img: string;
  };
  user_id: string;
  ISBN: number;
  genre: string[];
  jenis: string;
};

export type UpBookType = {
  title: string;
  writer: string;
  sinopsis: string;
  terbit: Date;
  user_id: string;
  ISBN: number;
  genre: string[];
  jenis: string;
  user: string;
  imgBooks: {
    public_id: string;
    imgUrl: string;
  };
};

export type DateBookType = {
  title: string;
  writer: string;
  sinopsis: string;
  terbit: Date;
  imgBooks: {
    public_id: string;
    imgUrl: string;
  };
  genre: string[];
};

export type ResultsBook = {
  _id: string;
  jenis: string;
};
