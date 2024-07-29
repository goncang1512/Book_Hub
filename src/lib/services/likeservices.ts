import { LikeModels } from "../models/storyModel";

export const likeSrv = {
  getLikeContent: async (story_id: string) => {
    return await LikeModels.find({ story_id });
  },
};

export const likeServices = {
  like: async (data: { user_id: string; story_id: string; user: string }) => {
    return await LikeModels.create(data);
  },
  getLikeUser: async (id: string) => {
    return await LikeModels.find({ user_id: id });
  },
  checkLike: async (user_id: string, story_id: string) => {
    return await LikeModels.findOne({ user_id, story_id });
  },
  dislike: async (user_id: string, story_id: string) => {
    const like = await LikeModels.findOneAndDelete({ user_id, story_id });
    return like;
  },
  likeContent: async (story_id: string) => await LikeModels.find({ story_id }),
};
