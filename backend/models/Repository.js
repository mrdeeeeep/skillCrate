const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  githubId: String,
  name: String,
  full_name: String,
  description: String,
  url: String,
  stars: Number,
  language: String,
  topics: [String],
  fetched_from: String,
  userInteractions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 0, max: 10 },
    relevance: { type: Boolean, default: null }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Repository', repositorySchema);
