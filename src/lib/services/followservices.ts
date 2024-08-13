import FollowerModels from "../models/followerModles";

export const followServices = {
  followUser: async (user_id: string, follower_id: string) => {
    const data = {
      user_id,
      follower_id,
      user: user_id,
      follower: follower_id,
    };
    return await FollowerModels.create(data);
  },
  unfollowUser: async (user_id: string, follower_id: string) => {
    return await FollowerModels.findOneAndDelete({ user_id, follower_id });
  },
  getMengikuti: async (user_id: string) => {
    return await FollowerModels.find({ user_id })
      .populate({
        path: "follower",
        model: "users",
        select: "_id username email imgProfil role badge",
      })
      .sort({
        createdAt: -1,
      });
  },
  getDiikuti: async (follower_id: string) => {
    return await FollowerModels.find({ follower_id })
      .populate({
        path: "user",
        model: "users",
        select: "_id username email imgProfil role badge",
      })
      .sort({
        createdAt: -1,
      });
  },
  checkFollower: async (user_id: string, follower_id: string) => {
    return await FollowerModels.findOne({ user_id, follower_id });
  },
};
