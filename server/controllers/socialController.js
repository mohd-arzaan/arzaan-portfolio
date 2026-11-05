import SocialLink from "../models/SocialLink.js";

// @desc    Get all social links
// @route   GET /api/socials
// @access  Public
export const getSocials = async (req, res) => {
  try {
    const socials = await SocialLink.find().sort({ createdAt: -1 });
    res.status(200).json(socials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add a social link
// @route   POST /api/socials
// @access  Private
export const addSocial = async (req, res) => {
  try {
    const { platform, url } = req.body;
    if (!platform || !url) return res.status(400).json({ message: "Platform and URL are required" });

    const social = await SocialLink.create({ platform, url });
    res.status(201).json(social);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a social link
// @route   DELETE /api/socials/:id
// @access  Private
export const deleteSocial = async (req, res) => {
  try {
    const social = await SocialLink.findById(req.params.id);
    if (!social) return res.status(404).json({ message: "Social link not found" });

    await social.deleteOne();
    res.status(200).json({ message: "Social link removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};