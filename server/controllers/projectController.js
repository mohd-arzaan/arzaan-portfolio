import Project from "../models/Project.js";

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin only)
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, image, liveLink, githubLink } = req.body;

    if (!title || !description || !techStack || !image) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const project = await Project.create({
      title,
      description,
      techStack,
      image,
      liveLink,
      githubLink,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};