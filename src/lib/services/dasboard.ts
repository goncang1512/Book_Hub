import UserModels from "../models/users";

export const dasboardServices = {
  pathcRole: async (user_id: string, role: string) => {
    return await UserModels.findOneAndUpdate(
      { _id: user_id },
      { $set: { role: role } },
      { new: true },
    );
  },
  searchUser: async (keyword: string | null) => {
    return await UserModels.find({
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });
  },
  patchBadge: async (user_id: string, badge: string[]) => {
    return await UserModels.findOneAndUpdate(
      {
        _id: user_id,
      },
      {
        $set: { badge: badge },
      },
      {
        new: true,
      },
    );
  },
};
