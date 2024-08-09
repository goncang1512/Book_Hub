import { MisiUserModels, MissionModels } from "../models/missionModels";

export const misiServices = {
  addMisiUser: async (user_id: string, mission_id: string, type: string) => {
    const data = {
      user_id,
      user: user_id,
      mission_id,
      mission: mission_id,
      process: 1,
      type,
      status: false,
    };
    return await MisiUserModels.create(data);
  },
  updateMisiUser: async (
    user_id: string,
    mission_id: string,
    type: string,
    process: number,
    status: boolean,
  ) => {
    const misi = await MisiUserModels.findOneAndUpdate(
      { user_id, mission_id, type },
      { $set: { process: (process += 1), status } },
      { new: true },
    );

    return misi;
  },
  getMisiUser: async (user_id: string, mission_id: string) => {
    return await MisiUserModels.findOne({ user_id, mission_id });
  },
  makeMission: async (judul: string, detail: string, link: string, type: string, max: number) => {
    const data = {
      judul,
      detail,
      link,
      type,
      max,
    };

    return await MissionModels.create(data);
  },
  getMisiUserId: async (user_id: string) => {
    return await MisiUserModels.find({ user_id }).populate({
      path: "mission",
      model: "missions",
    });
  },
  getMission: async (mission_id: string) => {
    return await MissionModels.findOne({ _id: mission_id });
  },
  getMissionUser: async (user_id: string) => {
    const mission = await MissionModels.find({ type: "Harian" });
    let misiUser: any[] = [];
    let misiPlayer: any[] = [];

    for (const misi of mission) {
      const userMissions = await MisiUserModels.find({ user_id, mission_id: misi._id });

      if (userMissions.length > 0) {
        misiUser.push(userMissions);
      } else {
        misiUser.push([]);
      }
    }

    mission.map((misi, index: number) => {
      const visi = misi.toObject ? misi.toObject() : misi;
      const missionDetail = {
        ...visi,
        misiUser: misiUser[index],
      };
      misiPlayer.push(missionDetail);
    });

    return misiPlayer;
  },
  udpateHarian: async () => {
    return await MisiUserModels.deleteMany({ type: "Harian" });
  },
  getMyMisi: async (misiUser_id: string) => {
    return await MisiUserModels.findOne({ _id: misiUser_id });
  },
  updateMyMisi: async (misiUser_id: string) => {
    return await MisiUserModels.findOneAndUpdate({ _id: misiUser_id }, { $set: { claim: true } });
  },
};

export const applayMission = async (user_id: string, mission_id: string) => {
  const mission = await misiServices.getMission(mission_id);
  const misiUser = await misiServices.getMisiUser(user_id, mission._id);

  const type = "Harian";
  if (misiUser) {
    if (misiUser.status) return;
    let statusMisi =
      mission?.max === misiUser?.process + 1 || misiUser.process > mission?.max ? true : false;
    await misiServices.updateMisiUser(user_id, mission_id, type, misiUser.process, statusMisi);
  } else {
    await misiServices.addMisiUser(user_id, mission_id, type);
  }
};
