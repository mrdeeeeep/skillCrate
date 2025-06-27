const mongoose = require('mongoose');

const academicPaperSchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  coreId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  authors: [{
    type: String
  }],
  abstract: {
    type: String
  },
  yearPublished: {
    type: Number
  },
  publisher: {
    type: String
  },
  subjects: [{
    type: String
  }],
  language: {
    type: String
  },
  downloadUrl: {
    type: String
  },
  sourceUrl: {
    type: String
  },
  journal: {
    type: String
  },
  doi: {
    type: String
  },
  url: {
    type: String
  },
  tags: [{
    type: String
  }],
  fetched_from: {
    type: String // e.g., CORE API
  },
  userInteractions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 0, max: 10 },
    relevance: { type: Boolean, default: null }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('AcademicPaper', academicPaperSchema);
