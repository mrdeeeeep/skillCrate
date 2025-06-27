const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ebookController = require('../controllers/ebookController');

// Fetch and save ebooks for a project by keywords
router.post('/:projectId', auth, ebookController.addEBooks);

// Get ebooks by project
router.get('/project/:projectId', auth, ebookController.getEBooksByProject);

module.exports = router;
