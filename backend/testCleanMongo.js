require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const AcademicPaper = require('./models/AcademicPaper');
const Video = require('./models/Video');

const MONGO_URI = process.env.MONGO_URI;

async function cleanAllCollections() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await Promise.all([
      Project.deleteMany({}),
      AcademicPaper.deleteMany({}),
      Video.deleteMany({})
    ]);

    console.log('All collections cleaned!');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

cleanAllCollections();