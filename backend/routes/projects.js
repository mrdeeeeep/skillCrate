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
        q: keywords.join(' '),
        type: ['video'],
        maxResults: 10,
        relevanceLanguage: 'en',
        videoCategoryId: '27'
      });

      console.log(`Found ${searchResponse.data.items.length} videos`);

      // Save videos one by one
      const savedVideos = [];
      for (const item of searchResponse.data.items) {
        try {
          const videoDetails = await youtube.videos.list({
            part: ['contentDetails', 'statistics'],
            id: [item.id.videoId]
          });

          const videoData = {
            pid: project._id,
            video_id: item.id.videoId,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail_urls: {
              default: item.snippet.thumbnails.default.url,
              medium: item.snippet.thumbnails.medium.url,
              high: item.snippet.thumbnails.high.url
            },
            channel_title: item.snippet.channelTitle,
            channel_id: item.snippet.channelId,
            published_at: item.snippet.publishedAt,
            duration: videoDetails.data.items[0].contentDetails.duration,
            view_count: parseInt(videoDetails.data.items[0].statistics.viewCount),
            like_count: parseInt(videoDetails.data.items[0].statistics.likeCount || 0)
          };

          // Try to save video, ignore duplicates
          const video = new Video(videoData);
          const savedVideo = await video.save();
          savedVideos.push(savedVideo);
          console.log('Saved video:', savedVideo._id);
        } catch (videoError) {
          if (videoError.code === 11000) {
            console.log('Duplicate video, skipping:', item.id.videoId);
            continue;
          }
          console.error('Error saving video:', videoError);
        }
      }

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
