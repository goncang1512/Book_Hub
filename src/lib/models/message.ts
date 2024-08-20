import { model, models, Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    message: {
      type: String,
    },
    status: {
      type: Boolean,
    },
    user_id: {
      type: [{ type: Schema.Types.ObjectId, ref: "users" }],
      validate: {
        validator: function (arr: any) {
          return arr.length <= 2;
        },
        message: "Array user_id tidak boleh lebih dari 2 elemen.",
      },
    },
  },
  {
    timestamps: true,
    collection: "messages",
  },
);

const MessageModels = models?.messages || model("messages", MessageSchema);

export default MessageModels;
