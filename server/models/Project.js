import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], required: true },
    liveLink: { type: String },
    githubLink: { type: String },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;