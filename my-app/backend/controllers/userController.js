const User = require("../models/User");
const { EXPERIENCE_LEVELS } = require("../models/User");
const { normalizeTags, MAX_TAGS, MAX_TAG_LENGTH } = require("../lib/matching/tags");

const TAG_FIELDS = ["skills", "interests", "rolesSought"];
const MIN_HOURS = 0;
const MAX_HOURS = 80;

// Shape returned by both GET and PATCH /api/users/me so the profile editor can round-trip.
// Never includes password / passwordHash.
function serializeUser(user) {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    college: user.college,
    skills: user.skills || [],
    interests: user.interests || [],
    rolesSought: user.rolesSought || [],
    experienceLevel: user.experienceLevel ?? null,
    availabilityHoursPerWeek: user.availabilityHoursPerWeek ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

// Validates + normalizes the matching fields. Returns { set, unset } for the update.
// Throws a 400 error with a clear message on bad input.
function parseMatchingFields(body) {
  const set = {};
  const unset = {};

  for (const field of TAG_FIELDS) {
    if (!(field in body)) continue;
    const value = body[field];

    if (!Array.isArray(value) || !value.every((t) => typeof t === "string")) {
      throw badRequest(`${field} must be an array of strings`);
    }
    if (value.some((t) => t.trim().length > MAX_TAG_LENGTH)) {
      throw badRequest(`${field} tags must be ${MAX_TAG_LENGTH} characters or fewer`);
    }

    const tags = normalizeTags(value);
    if (tags.length > MAX_TAGS) {
      throw badRequest(`${field} can have at most ${MAX_TAGS} tags`);
    }
    set[field] = tags;
  }

  if ("experienceLevel" in body) {
    const value = body.experienceLevel;
    if (value === null || value === "") {
      unset.experienceLevel = "";
    } else if (typeof value === "string" && EXPERIENCE_LEVELS.includes(value.trim().toLowerCase())) {
      set.experienceLevel = value.trim().toLowerCase();
    } else {
      throw badRequest(`experienceLevel must be one of: ${EXPERIENCE_LEVELS.join(", ")} (or null to clear)`);
    }
  }

  if ("availabilityHoursPerWeek" in body) {
    const value = body.availabilityHoursPerWeek;
    if (value === null) {
      unset.availabilityHoursPerWeek = "";
    } else if (typeof value === "number" && Number.isFinite(value) && value >= MIN_HOURS && value <= MAX_HOURS) {
      set.availabilityHoursPerWeek = value;
    } else {
      throw badRequest(`availabilityHoursPerWeek must be a number from ${MIN_HOURS} to ${MAX_HOURS} (or null to clear)`);
    }
  }

  return { set, unset };
}

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

    return res.status(200).json(serializeUser(user));
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({ message: err.message || "Server error" });
  }
};

// Main change: controller to update the current authenticated user's profile in the database.
// Accepts username, name, email, college plus the matching fields
// (skills, interests, rolesSought, experienceLevel, availabilityHoursPerWeek).
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const body = req.body || {};
    const { username, name, email, college } = body;

    const updates = {};

    if (typeof username === "string") updates.username = username.trim();
    if (typeof name === "string") updates.name = name.trim();
    if (typeof email === "string") updates.email = email.trim().toLowerCase();
    if (typeof college === "string") updates.college = college.trim();

    const { set, unset } = parseMatchingFields(body);
    Object.assign(updates, set);

    if (Object.keys(updates).length === 0 && Object.keys(unset).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    const updateDoc = {};
    if (Object.keys(updates).length) updateDoc.$set = updates;
    if (Object.keys(unset).length) updateDoc.$unset = unset;

    const user = await User.findByIdAndUpdate(userId, updateDoc, {
      returnDocument: "after",
      runValidators: true,
      context: "query",
    }).select("-password -passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(serializeUser(user));
  } catch (err) {
    const status = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
    return res.status(status).json({ message: err.message || "Server error" });
  }
};
