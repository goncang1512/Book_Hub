import { deletedAudio } from "../middleware/uploadImg";
import BooksModels from "../models/booksModels";
import CanvasModels from "../models/canvasModels";

export const bookAutServices = {
  mybook: async (id: string) => {
    return await BooksModels.find({ user_id: id, jenis: { $ne: "Review" } }).populate({
      path: "user",
      model: "users",
      select: "_id username email imgProfil role badge",
    });
  },
  post: async (dataChapter: any) => {
    return await CanvasModels.create(dataChapter);
  },
  getChapter: async (id: string, status: string) => {
    return await CanvasModels.find({ book_id: id, status });
  },
  submitted: async () => {
    return await CanvasModels.find({ status: "Submitted" }).populate(
      "book",
      "_id title writer ISBN terbit jenis createdAt updated imgBooks",
    );
  },
  existing: async (book_id: string, chapter: number) => {
    return await CanvasModels.findOne({ book_id, chapter });
  },
  existingBook: async (book_id: string, chapter_id: string, chapter: number) => {
    return await CanvasModels.findOne({
      book_id,
      chapter,
      _id: { $ne: chapter_id },
    });
  },
  lastChap: async (book_id: string) => {
    return await CanvasModels.findOne({ book_id }).sort({ createdAt: -1 });
  },
  readBook: async (id: string) => {
    return await CanvasModels.findOne({ _id: id });
  },
  updateCanvas: async (
    story: string,
    judul: string,
    chapter: string,
    status: string,
    id: string,
  ) => {
    return await CanvasModels.findOneAndUpdate(
      { _id: id },
      {
        $set: { story: story, judul: judul, chapter: chapter, status: status },
      },
      { new: true },
    );
  },
  deleted: async (canvas_id: string) => {
    const canvas = await CanvasModels.findOne({ _id: canvas_id });
    await deletedAudio(canvas.audio.public_id);

    return await CanvasModels.findOneAndDelete({ _id: canvas_id });
  },
  updateStatus: async (chapter_id: string, status: string) => {
    return await CanvasModels.findOneAndUpdate(
      { _id: chapter_id },
      { $set: { status: status } },
      { new: true },
    );
  },
  getCerpen: async (book_id: string) => {
    return await CanvasModels.find({ book_id: book_id });
  },
  addViewers: async (user_id: string, canvas_id: string) => {
    const readers = await CanvasModels.findById({ _id: canvas_id });
    readers.readers.push(user_id);
    const data = await readers.save();

    return data;
  },
};
