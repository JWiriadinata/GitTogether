const User = require("../models/User");

// Main change: controller to return the current authenticated user's profile without password fields
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId).select("-password -passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      college: user.college,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

// Main change: controller to update the current authenticated user's profile in the database
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { username, name, email, college } = req.body || {};

    const updates = {};

    if (typeof username === "string") updates.username = username.trim();
    if (typeof name === "string") updates.name = name.trim();
    if (typeof email === "string") updates.email = email.trim().toLowerCase();
    if (typeof college === "string") updates.college = college.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password -passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      college: user.college,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

