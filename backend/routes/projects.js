const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
};

// Create new project with videos
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating project with user:', req.user._id);
    const { title, keywords } = req.body;

    // Create project with user ID from auth middleware
    const project = new Project({
      uid: req.user._id,
      title,
      keywords
    });
    await project.save();
    console.log('Project created:', project._id);

    try {
      // Fetch videos from YouTube
      const searchResponse = await youtube.search.list({
        part: ['snippet'],
        q: `${keywords.join(' ')} -shorts`,
        type: ['video'],
        videoDuration: 'medium', // Excludes very short videos
        maxResults: 20, // Get more results since we'll filter some out
        relevanceLanguage: 'en',
        videoCategoryId: '27'
      });

      console.log(`Found ${searchResponse.data.items.length} videos`);

      // Get detailed video information
      const videoIds = searchResponse.data.items.map(item => item.id.videoId);
      const videoDetails = await youtube.videos.list({
        part: ['contentDetails', 'statistics', 'snippet'],
        id: videoIds
      });

      // Filter videos by duration
      const validVideos = videoDetails.data.items.filter(video => {
        const durationInSeconds = parseDuration(video.contentDetails.duration);
        return durationInSeconds >= 60;
      }).slice(0, 10); // Take first 10 valid videos

      // Save filtered videos
      const savedVideos = await Promise.all(validVideos.map(async video => {
        const videoData = {
          pid: project._id,
          video_id: video.id,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail_urls: {
            default: video.snippet.thumbnails?.default?.url || '',
            medium: video.snippet.thumbnails?.medium?.url || '',
            high: video.snippet.thumbnails?.high?.url || ''
          },
          channel_title: video.snippet.channelTitle,
          channel_id: video.snippet.channelId,
          published_at: video.snippet.publishedAt,
          duration: video.contentDetails.duration,
          view_count: parseInt(video.statistics.viewCount),
          like_count: parseInt(video.statistics.likeCount || 0)
        };
        return new Video(videoData).save();
      }));

      // Update project with saved videos
      project.videos = savedVideos.map(video => video._id);
      project.videosFetched = true;
      await project.save();

      res.status(201).json({
        project,
        videos: savedVideos,
        totalVideos: savedVideos.length
      });
    } catch (videoFetchError) {
      console.error('Error fetching videos:', videoFetchError);
      res.status(201).json({
        project,
        videos: [],
        warning: 'Failed to fetch videos, but project was created'
      });
    }
  } catch (error) {
    console.error('Project creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ uid: req.user._id })
      .populate('videos')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      uid: req.user._id
    }).populate('videos');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
