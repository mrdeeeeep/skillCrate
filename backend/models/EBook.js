const mongoose = require('mongoose');

const eBookSchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  googleId: String,
  title: String,
  authors: [String],
  description: String,
  publisher: String,
  publishedDate: String,
  categories: [String],
  language: String,
  pageCount: Number,
  previewLink: String,
  infoLink: String,
  thumbnail: String,
  tags: [String],
  fetched_from: String,
  userInteractions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 0, max: 10 },
    relevance: { type: Boolean, default: null }
  }]
}, { timestamps: true });

module.exports = mongoose.model('EBook', eBookSchema);
