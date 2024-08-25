import StoryModels from "../models/storyModel";
import { bookAutServices } from "../services/bookauthor";
import { likeSrv } from "../services/likeservices";
import { whislistSrv } from "../services/whilistservices";

type StorysType = {
  _id: string;
  story_id: string;
  user_id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    imgProfil: {
      public_id: string;
      imgUrl: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
};

export const getLikeStorySingle = async (story: any) => {
  const like = await likeSrv.getLikeContent(story._id);
  const kisah = story.toObject ? story.toObject() : story;
  return {
    ...kisah,
    like_str: like,
  };
};

export const getLikeContent = async (storys: StorysType[]) => {
  let likeStory: any[] = [];

  for (const cerita of storys) {
    const like = await likeSrv.getLikeContent(cerita._id);
    likeStory.push(like);
  }

  return storys?.map((cerita: any, index) => {
    const kisah = cerita.toObject ? cerita.toObject() : cerita;
    return {
      ...kisah,
      like_str: likeStory[index],
    };
  });
};

type BookType = {
  title: string;
  _id: string;
  user_id: string;
  writer: string;
  genre: string[];
};

export const getListBook = async (books: BookType[]) => {
  let listBook = [];

  for (const book of books) {
    const list = await whislistSrv.getListBook(book._id);
    listBook.push(list);
  }

  return books?.map((book: any, index: number) => {
    const buku = book.toObject ? book.toObject() : book;

    return {
      ...buku,
      listBook: listBook[index],
    };
  });
};

export const getWhislist = async (user_id: string) => {
  const myList = await whislistSrv.getMyList(user_id);

  let listBook = [];
  for (const book of myList) {
    const list = await whislistSrv.getListBook(book.book_id);
    listBook.push(list);
  }

  return myList?.map((book: any, index: number) => {
    const buku = book.toObject ? book.toObject() : book;

    return {
      ...buku.book,
      halaman: myList[index].halaman,
      listBook: listBook[index],
    };
  });
};

export async function processBooks(books: any) {
  let statusBook: any[] = [];

  for (let book of books) {
    if (book.jenis === "Cerpen") {
      const canvas = await bookAutServices.getCerpen(book._id);
      if (canvas.length > 0) {
        canvas.forEach((item) => {
          statusBook.push({
            _id: item._id,
            book_id: item.book_id,
            status: item.status,
          });
        });
      } else {
        statusBook.push({ _id: null, book_id: book._id, status: null });
      }
    }
  }

  return statusBook;
}

export const getBalasan = async (storys: StorysType[]) => {
  let balasanSum: any[] = [];

  for (const cerita of storys) {
    const like = await StoryModels.find({ book_id: cerita._id, type: "balasan" });
    balasanSum.push(like);
  }

  return storys?.map((cerita: any, index) => {
    const kisah = cerita.toObject ? cerita.toObject() : cerita;
    return {
      ...kisah,
      balasanSum: balasanSum[index],
    };
  });
};
