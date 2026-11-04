import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Mohd Arzaan" },
    role: { type: String, default: "MERN Stack Developer" },
    tagline: { type: String, default: "Building web experiences." },
    description: { type: String, default: "I am a web developer..." },
    aboutText: { type: String, default: "Detailed about me text..." },
  },
  { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);
export default About;