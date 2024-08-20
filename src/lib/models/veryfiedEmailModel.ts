import { Schema, model, models } from "mongoose";

const VeryfiedEmail = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    confpassword: {
      type: String,
    },
    codeOtp: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "veryfied_model",
  },
);

const VeryfiedModel = models?.veryfied_model || model("veryfied_model", VeryfiedEmail);

export default VeryfiedModel;
