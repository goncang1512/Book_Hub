import BooksModels from "../models/booksModels";
import CanvasModels from "../models/canvasModels";
import StoryModels, { LikeModels } from "../models/storyModel";
import WhislistModels from "../models/whislistModel";

export const bookServ = {
  recomended: async (book: any) => {
    const canvas = await CanvasModels.find({ book_id: book?._id });

    let sumReaders: number = 0;
    for (const kertas of canvas) {
      const jumlah = await CanvasModels.findOne({ _id: kertas._id });
      sumReaders += jumlah?.readers?.length;
    }

    const bookObject = book.toObject ? book.toObject() : book;

    return { ...bookObject, sumReaders };
  },
  updateNewChapter: async (book_id: string, tanggal: Date) => {
    return await BooksModels.findOneAndUpdate(
      { _id: book_id },
      { $set: { newChapter: tanggal } },
      { new: true },
    );
  },
  jenisTrending: async (book: any) => {
    const stories = await StoryModels.find({ book_id: book?._id });

    const bookObject = book.toObject ? book.toObject() : book;
    return { ...bookObject, sumReaders: stories?.length };
  },
};

export type BookType = {
  title: string;
  writer: string;
  terbit: string;
  sinopsis: string;
  imgBooks: {
    size: number;
    type: string;
    img: string;
  };
};

export const bookServices = {
  upload: async (body: any) => {
    return await BooksModels.create(body);
  },
  getAll: async () => {
    return await BooksModels.find().sort({ newChapter: -1, updatedAt: -1 });
  },
  getPage: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await BooksModels.find().sort({ newChapter: -1, updatedAt: -1 }).skip(skip).limit(limit);
  },
  byId: async (id: string) => {
    return await BooksModels.find({ user_id: id }).sort({ updatedAt: -1 });
  },
  byIdBook: async (id: string) => await BooksModels.findOne({ _id: id }),
  deleteBook: async (id: string) => {
    const book = await BooksModels.findOne({ _id: id });
    const stories = await StoryModels.find({ book_id: id });
    const storyIds = stories.map((story) => story._id);
    await CanvasModels.deleteMany({ book_id: id });
    await WhislistModels.findOneAndDelete({
      user_id: book.user_id,
      book_id: id,
    });
    await LikeModels.deleteMany({ story_id: { $in: storyIds } });
    await StoryModels.deleteMany({ book_id: id });
    await BooksModels.findOneAndDelete({ _id: id });

    return book;
  },
  update: async (body: BookType, id: string) => {
    return await BooksModels.findOneAndUpdate({ _id: id }, { $set: body });
  },
  searchBook: async (title: string | null) => {
    return await BooksModels.find({ title: { $regex: title, $options: "i" } });
  },
  deleteMany: async (user_id: string) => {
    const book = await BooksModels.findOne({ user_id });
    await StoryModels.deleteMany({ _id: book._id });
    return await BooksModels.deleteMany({ user_id });
  },
};
