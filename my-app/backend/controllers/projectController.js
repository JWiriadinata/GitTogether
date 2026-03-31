const mongoose = require("mongoose");
const Project = require("../models/Project");

function serializeUserLite(u) {
  if (!u) return null;
  return {
    id: u._id,
    username: u.username,
    name: u.name,
  };
}

function projectToJSON(doc, currentUserId) {
  const o = doc.owner && typeof doc.owner === "object" ? doc.owner : null;
  const ownerId =
    o && o._id ? o._id : doc.owner;

  const interested = doc.interestedUsers || [];
  const interestedList = interested
    .filter((u) => u && typeof u === "object" && u._id)
    .map(serializeUserLite);

  const interestedIds = interested.map((u) =>
    typeof u === "object" && u._id ? u._id.toString() : String(u)
  );

  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    owner: serializeUserLite(o) || { id: ownerId },
    interestedCount: interestedIds.length,
    interestedUsers: interestedList,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    meInterested: currentUserId
      ? interestedIds.includes(currentUserId.toString())
      : false,
    isMine: currentUserId
      ? ownerId.toString() === currentUserId.toString()
      : false,
  };
}

function projectListItemToJSON(doc, currentUserId) {
  const o = doc.owner && typeof doc.owner === "object" ? doc.owner : null;
  const ownerId = o && o._id ? o._id : doc.owner;
  const interestedIds = (doc.interestedUsers || []).map((u) =>
    typeof u === "object" && u._id ? u._id.toString() : String(u)
  );

  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    owner: serializeUserLite(o) || { id: ownerId },
    interestedCount: interestedIds.length,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    meInterested: currentUserId
      ? interestedIds.includes(currentUserId.toString())
      : false,
    isMine: currentUserId
      ? ownerId.toString() === currentUserId.toString()
      : false,
  };
}

exports.listProjects = async (req, res) => {
  try {
    const uid = req.user && req.user.id;
    const projects = await Project.find()
      .sort({ updatedAt: -1 })
      .populate("owner", "username name")
      .lean();

    const body = projects.map((p) => projectListItemToJSON(p, uid));
    return res.status(200).json(body);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.getProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    const uid = req.user && req.user.id;
    const project = await Project.findById(id)
      .populate("owner", "username name")
      .populate("interestedUsers", "username name")
      .lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(projectToJSON(project, uid));
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.createProject = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description } = req.body || {};
    const t = typeof title === "string" ? title.trim() : "";
    if (!t) {
      return res.status(400).json({ message: "Title is required" });
    }

    const desc =
      typeof description === "string" ? description.trim() : "";

    const project = await Project.create({
      title: t,
      description: desc,
      owner: userId,
      interestedUsers: [],
    });

    const populated = await Project.findById(project._id)
      .populate("owner", "username name")
      .populate("interestedUsers", "username name")
      .lean();

    return res.status(201).json(projectToJSON(populated, userId));
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.setInterest = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const interested =
      req.body && Object.prototype.hasOwnProperty.call(req.body, "interested")
        ? Boolean(req.body.interested)
        : null;

    if (interested === null) {
      return res
        .status(400)
        .json({ message: "Body must include interested: true or false" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot mark interest on your own project",
      });
    }

    if (interested) {
      await Project.updateOne(
        { _id: id },
        { $addToSet: { interestedUsers: userId } }
      );
    } else {
      await Project.updateOne(
        { _id: id },
        { $pull: { interestedUsers: userId } }
      );
    }

    const updated = await Project.findById(id)
      .populate("owner", "username name")
      .populate("interestedUsers", "username name")
      .lean();

    return res.status(200).json(projectToJSON(updated, userId));
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};
