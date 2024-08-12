import { model, models, Schema } from "mongoose";

const FollowerSchema = new Schema(
  {
    user_id: {
      type: String,
    },
    follower_id: {
      type: String,
    },
    user: {
      type: Schema.ObjectId,
      ref: "users",
    },
    follower: {
      type: Schema.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
    collection: "followers",
  },
);

const FollowerModels = models.followers || model("followers", FollowerSchema);

export default FollowerModels;
