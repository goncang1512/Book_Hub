import WhislistModels from "../models/whislistModel";

export const whislistSrv = {
  addList: async (user_id: string, book_id: string) => {
    return await WhislistModels.create({
      user_id,
      book_id,
      user: user_id,
      book: book_id,
      halaman: 0,
    });
  },
  removeList: async (user_id: string, book_id: string) => {
    return await WhislistModels.deleteOne({ user_id, book_id });
  },
  getListBook: async (book_id: string) => {
    return await WhislistModels.find({ book_id }).populate({
      path: "book",
      model: "books",
      select: "",
    });
  },
  getMyList: async (user_id: string) => {
    return await WhislistModels.find({ user_id }).populate({
      path: "book",
      model: "books",
      select: "",
    });
  },
  updateHal: async (book_id: string, user_id: string, halaman: number) => {
    return await WhislistModels.updateOne(
      { book_id, user_id },
      { $set: { halaman } },
      { new: true },
    );
  },
  checkList: async (user_id: string, book_id: string) => {
    return await WhislistModels.findOne({ user_id, book_id });
  },
  deleteMany: async (book_id: string) => {
    return await WhislistModels.deleteMany({ book_id });
  },
  getOne: async (book_id: string) => {
    return await WhislistModels.find({ book_id })
      .populate({
        path: "user",
        model: "users",
        select: "_id username email imgProfil",
      })
      .populate({
        path: "book",
        model: "books",
        select: "",
      });
  },
};
