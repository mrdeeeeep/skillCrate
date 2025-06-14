const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new project
router.post('/', async (req, res) => {
  try {
    const { title, keywords } = req.body;
    const uid = req.user.id; // Assuming you'll add auth middleware

    const project = await Project.create({
      uid,
      title,
      keywords: keywords || []
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const { title, keywords } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, uid: req.user.id },
      { title, keywords },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      uid: req.user.id
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      uid: req.user.id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's projects
router.get('/', async (req, res) => {
  try {
    const uid = req.user.id; // Assuming you'll add auth middleware
    const projects = await Project.find({ uid });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
