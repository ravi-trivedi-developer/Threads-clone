import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Community =
  mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
