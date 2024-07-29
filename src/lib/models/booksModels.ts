import mongoose, { model, Schema } from "mongoose";

const BookSchema = new Schema(
  {
    user_id: {
      type: String,
    },
    title: {
      type: String,
    },
    writer: {
      type: String,
    },
    genre: {
      type: [String],
    },
    sinopsis: { type: String, trim: false },
    terbit: {
      type: String,
    },
    imgBooks: {
      public_id: {
        type: String,
      },
      imgUrl: {
        type: String,
      },
    },
    jenis: {
      type: String,
    },
    tranding: {
      status: {
        type: Boolean,
      },
      ranking: {
        type: Number,
      },
    },
    whislist: {
      type: [
        {
          user_id: { type: Schema.Types.ObjectId, ref: "users" },
          halaman: { type: Number },
        },
      ],
    },
    newChapter: {
      type: Date,
    },
    ISBN: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const modelName = "books";
const existingModel = mongoose.connection.models[modelName];
const BooksModels = existingModel || model("books", BookSchema);

export default BooksModels;
