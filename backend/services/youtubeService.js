const { google } = require('googleapis');
const youtube = google.youtube('v3');

const youtubeService = {
  extractVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  },

  async getVideoDetails(videoId) {
    try {
      const response = await youtube.videos.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ['snippet', 'contentDetails', 'statistics'],
        id: [videoId]
      });

      const videoData = response.data.items[0];
      
      return {
        title: videoData.snippet.title,
        description: videoData.snippet.description,
        category_id: videoData.snippet.categoryId,
        category_title: this.getCategoryTitle(videoData.snippet.categoryId),
        tags: videoData.snippet.tags || [],
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail_urls: {
          default: videoData.snippet.thumbnails.default.url,
          medium: videoData.snippet.thumbnails.medium.url,
          high: videoData.snippet.thumbnails.high.url
        },
        channel_title: videoData.snippet.channelTitle,
        channel_id: videoData.snippet.channelId,
        published_at: videoData.snippet.publishedAt,
        duration: videoData.contentDetails.duration,
        view_count: parseInt(videoData.statistics.viewCount),
        like_count: parseInt(videoData.statistics.likeCount)
      };
    } catch (error) {
      throw new Error('Failed to fetch video details from YouTube');
    }
  },

  async searchVideos(keywords, maxResults = 10) {
    try {
      console.log('🔍 Searching videos for keywords:', keywords);
      const searchQuery = keywords.join('|');
      
      const searchParams = {
        key: process.env.YOUTUBE_API_KEY,
        part: ['snippet'],
        q: searchQuery,
        type: ['video'],
        videoCategoryId: ['27', '28'], // Education and Science & Technology
        maxResults,
        relevanceLanguage: 'en',
        safeSearch: 'moderate',
      };
      
      console.log('📤 Search request params:', JSON.stringify(searchParams, null, 2));
      
      const response = await youtube.search.list(searchParams);
      console.log('📥 Search response items count:', response.data.items.length);
      
      if (!response.data.items.length) {
        console.warn('⚠️ No videos found in search response');
        return [];
      }

      const videoIds = response.data.items.map(item => item.id.videoId);
      console.log('🎥 Found video IDs:', videoIds);
      
      const videoDetails = await this.getVideosDetails(videoIds);
      console.log(`✅ Retrieved details for ${videoDetails.length} videos`);
      
      return videoDetails;
    } catch (error) {
      console.error('❌ YouTube API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch videos from YouTube');
    }
  },

  async getVideosDetails(videoIds) {
    try {
      const response = await youtube.videos.list({
        key: process.env.YOUTUBE_API_KEY,
        part: ['snippet', 'contentDetails', 'statistics'],
        id: videoIds
      });

      return response.data.items.map(video => ({
        video_id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        category_id: video.snippet.categoryId,
        category_title: this.getCategoryTitle(video.snippet.categoryId),
        tags: video.snippet.tags || [],
        url: `https://www.youtube.com/watch?v=${video.id}`,
        thumbnail_urls: {
          default: video.snippet.thumbnails.default.url,
          medium: video.snippet.thumbnails.medium.url,
          high: video.snippet.thumbnails.high.url
        },
        channel_title: video.snippet.channelTitle,
        channel_id: video.snippet.channelId,
        published_at: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        view_count: parseInt(video.statistics.viewCount),
        like_count: parseInt(video.statistics.likeCount || 0)
      }));
    } catch (error) {
      throw new Error('Failed to fetch video details');
    }
  },

  getCategoryTitle(categoryId) {
    const categories = {
      '27': 'Education',
      '28': 'Science & Technology',
      '35': 'Documentary'
    };
    return categories[categoryId] || 'Unknown';
  }
};

module.exports = youtubeService;
