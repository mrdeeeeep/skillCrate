const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
    // Removed any unique constraint
  },
  keywords: [{
    type: String,
    trim: true
  }],
  videosFetched: {
    type: Boolean,
    default: false
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }]
}, {
  timestamps: true
});

// Add compound index for user's projects (optional, for better query performance)
projectSchema.index({ uid: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
