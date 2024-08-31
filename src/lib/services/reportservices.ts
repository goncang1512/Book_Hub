import ReportModels from "../models/reportModels";

const reportSrv = {
  post: async (data: { user_id: string; message: string; report: string; from: string }) => {
    return await ReportModels.create({ ...data, user: data.user_id });
  },
  getAll: async () => {
    return await ReportModels.find()
      .populate("user", "_id username imgProfil badge email role")
      .sort({ createdAt: 1 });
  },
  deleteOne: async (report_id: string) => {
    return await ReportModels.findOneAndDelete({ _id: report_id });
  },
};

export default reportSrv;
