const User = require("../models/UserRegistration");
const bcrypt = require("bcryptjs");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, admission, regulation, batchYear, password } = req.body;

    if (!name) return res.status(400).json({ message: "Name required" });
    if (!admission) return res.status(400).json({ message: "Admission required" });
    if (!regulation) return res.status(400).json({ message: "Regulation required" });
    if (!batchYear) return res.status(400).json({ message: "Batch year required" });
    if (!password) return res.status(400).json({ message: "Password required" });

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const exists = await User.findOne({ admission });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      admission,
      regulation,
      batchYear: Number(batchYear),
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { admission, password } = req.body;

    const user = await User.findOne({ admission });
    if (!user) {
      return res.status(400).json({ message: "Invalid admission or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid admission or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        branch: user.branch,
        regulation: user.regulation,
        batchYear: user.batchYear
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
