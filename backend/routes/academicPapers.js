const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const academicPaperController = require('../controllers/academicPaperController');

// Add academic papers to a project using CORE API
router.post('/:projectId', auth, academicPaperController.addAcademicPapers);

// Get all academic papers for a project
router.get('/project/:projectId', auth, academicPaperController.getPapersByProject);

module.exports = router;
