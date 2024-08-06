import { model, models, Schema } from "mongoose";

const MissionSchema = new Schema(
  {
    judul: {
      type: String,
    },
    detail: {
      type: String,
    },
    link: {
      type: String,
    },
    type: {
      type: String,
    },
    max: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "missions",
  },
);

export const MissionModels = models.missions || model("missions", MissionSchema);

const MisiUserSchema = new Schema(
  {
    user_id: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    mission_id: {
      type: String,
    },
    mission: {
      type: Schema.Types.ObjectId,
      ref: "missions",
    },
    type: {
      type: String,
    },
    process: {
      type: Number,
    },
    status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    collection: "misiusers",
  },
);

export const MisiUserModels = models.misiusers || model("misiusers", MisiUserSchema);
