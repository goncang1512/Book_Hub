import UserModels from "../models/users";
import VeryfiedModel from "../models/veryfiedEmailModel";
import instance from "../utils/fetch";

type UserUpdate = {
  username: string;
  alamat: string;
  email: string;
  number: string;
};

export const getNotifTitle = async (user_id: string) => {
  const res = await instance.get(`/api/message/notif/${user_id}`);

  return res;
};

export const userSevices = {
  get: async () => {
    return await UserModels.find();
  },
  post: async (body: any) => {
    return await UserModels.create(body);
  },
  getId: async (id: string) => {
    return await UserModels.find({ _id: id });
  },
  byEmailName: async (email: string, username: string) => {
    return await UserModels.findOne({
      $or: [{ email: email, username: username }],
    });
  },
  patch: async (id: string, body: UserUpdate) => {
    return await UserModels.findByIdAndUpdate({ _id: id }, { $set: body }, { new: true });
  },
  updateFoto: async (id: string, foto: any) => {
    return await UserModels.findByIdAndUpdate(
      { _id: id },
      { $set: { imgProfil: foto } },
      { new: true },
    );
  },
  deleteFotoProfil: async (id: string) => {
    return await UserModels.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          imgProfil: {
            public_id: "profil/ptkdih6zbetqjfddpqhf",
            imgUrl:
              "https://res.cloudinary.com/dykunvz4p/image/upload/c_fill,h_130,w_130/profil/ptkdih6zbetqjfddpqhf.jpg",
          },
        },
      },
      { new: true },
    );
  },
  deleteUserAccount: async (id: string) => {
    const user = await UserModels.findOne({ _id: id });
    await UserModels.findOneAndDelete({ _id: id });
    return user;
  },
  getUser: async (id: string) => {
    return await UserModels.findOne({ _id: id });
  },
  updateLvl: async (
    id: string,
    player: { level: number | undefined; experience: number | undefined },
  ) => {
    return await UserModels.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          "rank.level": player.level,
          "rank.experience": player.experience,
        },
      },
      { new: true },
    );
  },
  updateRank: async (id: string, img: string | undefined) => {
    return await UserModels.findOneAndUpdate(
      { _id: id },
      { $set: { "rank.rankNow": img } },
      { new: true },
    );
  },
  updateRankTertinggi: async (id: string, data: { img: string; no: number }) => {
    return await UserModels.findOneAndUpdate(
      { _id: id },
      { $set: { "rank.rankTertinggi": { img: data.img, no: data.no } } },
      { new: true },
    );
  },
  newSession: async (id: string, level: number, rankNow: string) => {
    return await UserModels.updateMany(
      { _id: id },
      {
        $set: {
          "rank.level": level,
          "rank.experience": 0,
          "rank.rankNow": rankNow,
        },
      },
      {
        new: true,
      },
    );
  },
  leaderbaord: async () => {
    return await UserModels.find({}, "_id username email imgProfil rank createdAt role badge").sort(
      {
        "rank.level": -1,
        "rank.experience": -1,
      },
    );
  },
  updatePassword: async (id: string, password: string) => {
    return await UserModels.findOneAndUpdate({ _id: id }, { $set: { password } }, { new: true });
  },
  updateEmail: async (email: string, user_id: string) => {
    return await UserModels.findOneAndUpdate({ _id: user_id }, { $set: { email } }, { new: true });
  },
  existingEmail: async (email: string, user_id: string) => {
    return await UserModels.findOne({ email, _id: { $ne: user_id } });
  },
};

export const veryfiedServices = {
  post: async (body: any) => {
    return await VeryfiedModel.create(body);
  },
  delete: async (id: string) => {
    return await VeryfiedModel.findOneAndDelete({ _id: id });
  },
  get: async (id: string) => {
    return await VeryfiedModel.findOne({ _id: id });
  },
  put: async (id: string, codeOTP: number) => {
    return await VeryfiedModel.findOneAndUpdate(
      { _id: id },
      { $set: { codeOtp: codeOTP } },
      { new: true },
    );
  },
  checkEmail: async (email: string) => {
    return await VeryfiedModel.findOne({ email });
  },
  checkEmailExit: async (codeOtp: number) => {
    return await VeryfiedModel.findOne({ codeOtp });
  },
  deleteVerified: async (email: string) => {
    return await VeryfiedModel.deleteOne({ email: email });
  },
};
