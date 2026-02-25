const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],   // e.g. ["React", "Node", "MongoDB"]
      default: [],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',      // Links back to the User model to ensure a relationship between posts and their creators
      required: true,
    },
    college: {
      type: String,  
    },
    rolesNeeded: {
      type: [String],   // e.g. ["Frontend Dev", "UI Designer"]
      default: [],
    },
    isOpen: {
      type: Boolean,
      default: true,    // A flag for to check whether a project still looking for people
    },
  },
  {
    timestamps: true,   // Auto-adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Project', ProjectSchema);