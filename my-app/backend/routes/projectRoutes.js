const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

router.post('/', verifyJWT, createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.patch('/:id', verifyJWT, updateProject);
router.delete('/:id', verifyJWT, deleteProject);

module.exports = router;