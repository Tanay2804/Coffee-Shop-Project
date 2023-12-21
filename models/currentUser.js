import mongoose from "mongoose";
//acts as a buffer
const currentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("currentUser", currentSchema);
