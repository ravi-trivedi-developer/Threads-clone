import mongoose from "mongoose";
import { string } from "zod";

const userSchema = new mongoose.Schema({
  id: {
    type: string,
    required: true,
  },
  username: {
    type: string,
    required: true,
    unique: true,
  },
  name: {
    type: string,
    required: true,
  },
  image: string,
  bio: string,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
