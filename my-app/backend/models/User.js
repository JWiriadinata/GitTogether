const mongoose = require("mongoose");

const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"];

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  college: { type: String, required: true },
  passwordHash: { type: String, required: true },

  // Matching profile fields. Tags are stored canonical + lowercase (see lib/matching/tags.js).
  skills: { type: [String], default: [] },       // e.g. "javascript", "react"
  interests: { type: [String], default: [] },    // e.g. "web-development", "machine-learning"
  rolesSought: { type: [String], default: [] },  // e.g. "frontend", "ui-designer"
  experienceLevel: { type: String, enum: EXPERIENCE_LEVELS, default: undefined },
  availabilityHoursPerWeek: { type: Number, min: 0, max: 80 }
}, { timestamps: true });

userSchema.index({ skills: 1 });
userSchema.index({ interests: 1 });
userSchema.index({ rolesSought: 1 });
userSchema.index({ college: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
module.exports.EXPERIENCE_LEVELS = EXPERIENCE_LEVELS;
