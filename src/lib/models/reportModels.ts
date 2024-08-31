import { model, models, Schema } from "mongoose";

const ReportSchema = new Schema(
  {
    message: {
      type: String,
    },
    report: {
      type: String,
    },
    user_id: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    from: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "reports",
  },
);

const ReportModels = models?.reports || model("reports", ReportSchema);

export default ReportModels;
