const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  relevance: {
    type: Boolean,
    default: null
  }
}, { _id: false });

const videoSchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  video_id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  category_id: String,
  category_title: String,
  tags: [String],
  thumbnail_urls: {
    default: String,
    medium: String,
    high: String
  },
  channel_title: String,
  channel_id: String,
  published_at: Date,
  duration: String,
  view_count: Number,
  like_count: Number,
  noOfClicks: {
    type: Number,
    default: 0
  },
  userInteractions: [userInteractionSchema]
}, {
  timestamps: true
});

// Remove any unique indexes if they exist
videoSchema.index({ pid: 1, video_id: 1 });

videoSchema.pre('save', function(next) {
  if (!this.url && this.video_id) {
    this.url = `https://www.youtube.com/watch?v=${this.video_id}`;
  }
  next();
});

module.exports = mongoose.model('Video', videoSchema);
