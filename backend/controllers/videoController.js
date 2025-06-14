const Video = require('../models/Video');
const Project = require('../models/Project');
const youtubeService = require('../services/youtubeService');

const videoController = {
  async addVideo(req, res) {
    try {
      const { videoUrl } = req.body;
      const projectId = req.params.projectId;
      
      // Extract video ID from YouTube URL
      const videoId = youtubeService.extractVideoId(videoUrl);
      
      // Fetch video details from YouTube
      const videoDetails = await youtubeService.getVideoDetails(videoId);
      
      const video = new Video({
        pid: projectId,
        video_id: videoId,
        ...videoDetails
      });

      await video.save();
      
      // Add video reference to project
      await Project.findByIdAndUpdate(projectId, {
        $push: { videos: video._id }
      });

      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getProjectVideos(req, res) {
    try {
      const videos = await Video.find({ pid: req.params.projectId });
      res.json(videos);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateUserInteraction(req, res) {
    try {
      const { rating, relevance } = req.body;
      const video = await Video.findById(req.params.videoId);
      
      // Update or add user interaction
      const interactionIndex = video.userInteractions.findIndex(
        i => i.userId.toString() === req.user._id.toString()
      );
      
      if (interactionIndex > -1) {
        video.userInteractions[interactionIndex] = { userId: req.user._id, rating, relevance };
      } else {
        video.userInteractions.push({ userId: req.user._id, rating, relevance });
      }
      
      if (rating === undefined) {
        video.noOfClicks += 1;
      }
      
      await video.save();
      res.json(video);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getVideoDetails(req, res) {
    try {
      const video = await Video.findById(req.params.videoId);
      if (!video) throw new Error('Video not found');
      res.json(video);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async deleteVideo(req, res) {
    try {
      const video = await Video.findById(req.params.videoId);
      if (!video) throw new Error('Video not found');
      
      // Remove video reference from project
      await Project.findByIdAndUpdate(video.pid, {
        $pull: { videos: video._id }
      });
      
      await video.remove();
      res.json({ message: 'Video deleted' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = videoController;
