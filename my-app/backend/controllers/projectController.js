const Project = require("../models/Project");
const User = require("../models/User");

// Creates a new project. The authenticated user becomes the creator.
// College is pulled from their profile automatically.
exports.createProject = async (req, res) => {
  try {
    const { title, description, techStack, rolesNeeded } = req.body || {};

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    // Look up the creator's college so it doesn't need to be submitted manually
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      techStack: Array.isArray(techStack) ? techStack : [],
      rolesNeeded: Array.isArray(rolesNeeded) ? rolesNeeded : [],
      creator: req.user.id,
      college: user.college,
    });

    return res.status(201).json({ project });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// Returns all open projects, newest first.
// Populates creator's username so the frontend can display it.
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isOpen: true })
      .populate("creator", "username name college")
      .sort({ createdAt: -1 });

    return res.status(200).json({ projects });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// Returns a single project by its ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "creator",
      "username name college"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// Updates a project. Only the creator is allowed to edit it.
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const allowed = ["title", "description", "techStack", "rolesNeeded", "isOpen"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();
    return res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// Deletes a project. Only the creator is allowed.
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    return res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
