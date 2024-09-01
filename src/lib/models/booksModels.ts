import { model, models, Schema } from "mongoose";

const BookSchema = new Schema(
  {
    user_id: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
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
      type: Date,
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
    newChapter: {
      type: Date,
    },
    ISBN: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "books",
  },
);

const BooksModels = models?.books || model("books", BookSchema);

export default BooksModels;
