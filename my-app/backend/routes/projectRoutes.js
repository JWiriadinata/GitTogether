const express = require("express");

const verifyJWT = require("../middleware/verifyJWT");
const optionalJWT = require("../middleware/optionalJWT");
const {
  listProjects,
  getProject,
  createProject,
  setInterest,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", optionalJWT, listProjects);
router.get("/:id", optionalJWT, getProject);
router.post("/", verifyJWT, createProject);
router.post("/:id/interest", verifyJWT, setInterest);

module.exports = router;
