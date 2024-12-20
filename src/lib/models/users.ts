import { model, Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    user_id: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    number: {
      type: String,
    },
    alamat: {
      type: String,
    },
    imgProfil: {
      public_id: {
        type: String,
      },
      imgUrl: {
        type: String,
      },
    },
    badge: [
      {
        type: String,
      },
    ],
    rank: {
      level: Number,
      experience: Number,
      rankNow: String,
      rankTertinggi: {
        img: String,
        no: Number,
      },
    },
    status: {
      type: String,
    },
    profileGround: {
      public_id: String,
      urlLatar: String,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    collection: "users",
  },
);

const UserModels = models?.users || model("users", UserSchema);

export default UserModels;
