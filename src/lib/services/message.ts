import MessageModels from "../models/message";

export const msgServices = {
  post: async (data: { senderId: string; recipientId: string; message: string }) => {
    const message = {
      message: data.message,
      user_id: [data.senderId, data.recipientId],
      status: true,
    };
    return await MessageModels.create(message);
  },
  getMsgRecepient: async (user_id: string) => {
    return await MessageModels.find({ "user_id.1": user_id })
      .populate({
        path: "user_id",
        model: "users",
        select: "_id username email imgProfil role badge",
      })
      .sort({ status: -1, createdAt: -1 });
  },
  getMsgDetail: async (msg_id: string) => {
    return await MessageModels.findOne({ _id: msg_id }).populate({
      path: "user_id",
      model: "users",
      select: "_id username email imgProfil role badge",
    });
  },
  readMessage: async (msg_id: string) => {
    return await MessageModels.findOneAndUpdate(
      { _id: msg_id },
      { $set: { status: false } },
      { new: true },
    );
  },
  deleteMsg: async (msg_id: string) => {
    return await MessageModels.findOneAndDelete({ _id: msg_id });
  },
  getMsgNotif: async (user_id: string) => {
    return await MessageModels.find({ "user_id.1": user_id, status: true });
  },
};
