import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check Email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // DEBUG KE LIYE YE 2 LINES ADD KI HAIN
    console.log("Postman Password:", password);
    console.log("ENV Hash:", process.env.ADMIN_PASSWORD_HASH);

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate Token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};