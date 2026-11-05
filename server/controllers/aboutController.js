import About from "../models/About.js";

// @desc    Get about info
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    // Agar database khali hai, toh ek default create kar do
    if (!about) {
      about = await About.create({});
    }
    
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update about info
// @route   PUT /api/about
// @access  Private
export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      // Agar exist nahi karta toh naya banao
      about = await About.create(req.body);
    } else {
      // Agar exist karta hai toh update karo
      about = await About.findByIdAndUpdate(about._id, req.body, { new: true });
    }

    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};