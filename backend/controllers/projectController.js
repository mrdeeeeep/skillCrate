const Project = require('../models/Project');
const Video = require('../models/Video');
const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

const projectController = {
  async create(req, res) {
    try {
      console.log('Creating project with:', req.body);
      const { title, keywords } = req.body;

      // Create the project first
      const project = new Project({
        uid: req.user._id,
        title,
        keywords
      });

      // Fetch videos from YouTube
      console.log('Fetching videos for keywords:', keywords);
      const searchQuery = keywords.join(' ');
      
      const searchResponse = await youtube.search.list({
        part: ['snippet'],
        q: searchQuery,
        type: ['video'],
        maxResults: 10,
        relevanceLanguage: 'en',
        videoCategoryId: '27' // Education category
      });

      // Process and save videos
      const videoPromises = searchResponse.data.items.map(async (item) => {
        // Get additional video details
        const videoDetails = await youtube.videos.list({
          part: ['contentDetails', 'statistics'],
          id: [item.id.videoId]
        });

        const videoData = {
          pid: project._id,
          video_id: item.id.videoId,
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

        const video = new Video(videoData);
        return video.save();
      });

      // Save all videos
      const savedVideos = await Promise.all(videoPromises);
      console.log(`Saved ${savedVideos.length} videos`);

      // Update project with video references
      project.videos = savedVideos.map(video => video._id);
      project.videosFetched = true;
      await project.save();

      // Return complete response
      res.status(201).json({
        project,
        videos: savedVideos,
        totalVideos: savedVideos.length
      });

    } catch (error) {
      console.error('Project creation error:', error);
      res.status(400).json({ 
        message: error.message,
        error: error.stack
      });
    }
  }
};

module.exports = projectController;
