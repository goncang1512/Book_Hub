import mongoose, { model, models, Schema } from "mongoose";

const StoryModel = new Schema(
  {
    user_id: {
      type: String,
    },
    book_id: {
      type: String,
    },
    type: {
      type: String,
    },
    ception: { type: String, trim: false },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  },
);

const StoryModels = models?.story || model("story", StoryModel);
export default StoryModels;

// Like Models
const LikeModel = new Schema(
  {
    story_id: {
      type: String,
    },
    user_id: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
    collection: "like_story",
  },
);

export const LikeModels = models.like_story || model("like_story", LikeModel);
