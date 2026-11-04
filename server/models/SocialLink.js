import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true }, // e.g., GitHub, LinkedIn
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const SocialLink = mongoose.model("SocialLink", socialLinkSchema);
export default SocialLink;