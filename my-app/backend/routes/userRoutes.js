const express = require("express");

const verifyJWT = require("../middleware/verifyJWT");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

// Main change: route to get the authenticated user's profile (protected)
router.get("/me", verifyJWT, getUserProfile);

// Main change: route to update the authenticated user's profile (protected)
router.patch("/me", verifyJWT, updateUserProfile);

module.exports = router;

