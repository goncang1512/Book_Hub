import UserModels from "../models/users";
import { followServices } from "../services/followservices";

export const getMyFollower = async (user_id: string) => {
  const result = await UserModels.findOne(
    { _id: user_id },
    "_id username email imgProfil rank role createdAt badge",
  );

  const getMengikuti = await followServices.getMengikuti(result._id);
  const diikuti = await followServices.getDiikuti(result._id);
  const userWithFollower = { ...result.toObject(), follower: getMengikuti, myFollower: diikuti };

  return userWithFollower;
};
