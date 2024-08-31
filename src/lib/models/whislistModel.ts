import mongoose, { Schema, model, models } from "mongoose";

const WhislistModel = new Schema(
  {
    book_id: {
      type: String,
    },
    user_id: {
      type: String,
    },
    halaman: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
    },
  },
  {
    timestamps: true,
    collection: "whislist",
  },
);

const WhislistModels = models?.whislist || model("whislist", WhislistModel);

export default WhislistModels;
