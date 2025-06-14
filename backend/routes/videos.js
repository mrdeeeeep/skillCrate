const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');

router.post('/:projectId', auth, videoController.addVideo);
router.get('/project/:projectId', auth, videoController.getProjectVideos);
router.patch('/:videoId/interaction', auth, videoController.updateUserInteraction);
router.get('/:videoId', auth, videoController.getVideoDetails);
router.delete('/:videoId', auth, videoController.deleteVideo);

module.exports = router;
