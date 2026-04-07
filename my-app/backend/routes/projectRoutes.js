const express = require("express");

const verifyJWT = require("../middleware/verifyJWT");
const optionalJWT = require("../middleware/optionalJWT");
const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  setInterest,
} = require("../controllers/projectController");

const router = express.Router();

// Reads are public; optionalJWT fills meInterested / isMine when a Bearer token is sent.
router.get("/", optionalJWT, listProjects);
router.get("/:id", optionalJWT, getProject);

// Writes require authentication; update/delete are further restricted to the owner in the controller.
router.post("/", verifyJWT, createProject);
router.patch("/:id", verifyJWT, updateProject);
router.put("/:id", verifyJWT, updateProject);
router.delete("/:id", verifyJWT, deleteProject);
router.post("/:id/interest", verifyJWT, setInterest);

module.exports = router;
