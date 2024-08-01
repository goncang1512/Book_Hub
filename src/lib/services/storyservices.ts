import StoryModels, { LikeModels } from "../models/storyModel";

export const storyServices = {
  upload: async (body: any) => {
    return await StoryModels.create(body);
  },
  getIdBook: async (id: string) => {
    return await StoryModels.find({ book_id: id })
      .populate("user", "_id username email imgProfil role badge rank")
      .sort({ updatedAt: -1 });
  },
  delete: async (id: string) => {
    const story = await StoryModels.findOne({ _id: id });
    await StoryModels.deleteMany({ book_id: id });
    await LikeModels.deleteMany({ story_id: id });
    await StoryModels.findOneAndDelete({ _id: id });
    return story;
  },
  update: async (ception: string, id: string) => {
    return await StoryModels.findOneAndUpdate(
      { _id: id },
      { $set: { ception: ception } },
      { new: true },
    );
  },
  getStoryUser: async (id: string) => {
    return await StoryModels.find({ user_id: id })
      .populate("user", "_id username email imgProfil badge rank")
      .populate("book")
      .sort({ updatedAt: -1 });
  },
  deleteManyByUser: async (id: string) => {
    return await StoryModels.deleteMany({ user_id: id });
  },
  detailStory: async (id: string) => {
    return await StoryModels.findOne({ _id: id })
      .populate("book")
      .populate("user", "_id username email imgProfil badge rank");
  },
};
