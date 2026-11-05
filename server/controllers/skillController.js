import Skill from "../models/Skill.js";

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add a skill
// @route   POST /api/skills
// @access  Private
export const addSkill = async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name) return res.status(400).json({ message: "Skill name is required" });

    const skill = await Skill.create({ name, category });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    await skill.deleteOne();
    res.status(200).json({ message: "Skill removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};