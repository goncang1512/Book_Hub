import mongoose, { model, models, Schema } from "mongoose";

const CanvasModel = new Schema(
  {
    user_id: {
      type: String,
    },
    judul: {
      type: String,
    },
    book_id: {
      type: String,
    },
    story: {
      type: String,
    },
    chapter: {
      type: Number,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
    },
    statUpdate: {
      type: String,
    },
    status: {
      type: String,
    },
    readers: [{ type: mongoose.Schema.ObjectId, ref: "users" }],
  },
  {
    timestamps: true,
    collection: "canvas",
  },
);

const CanvasModels = models?.canvas || model("canvas", CanvasModel);

export default CanvasModels;
