const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const repositoryController = require('../controllers/repositoryController');

// Fetch and save repositories for a project by keywords
router.post('/:projectId', auth, repositoryController.addRepositories);

// Get repositories by project
router.get('/project/:projectId', auth, repositoryController.getRepositoriesByProject);

module.exports = router;
