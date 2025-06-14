const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { google } = require('googleapis');
require('dotenv').config();

// Validate essential environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'YOUTUBE_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Test YouTube API key
const testYoutubeAPI = async () => {
  try {
    console.log('Testing YouTube API connection...');
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });

    const response = await youtube.search.list({
      part: ['snippet'],
      q: 'test',
      type: ['video'],
      maxResults: 1
    });

    console.log('✅ YouTube API is working!');
    return true;
  } catch (error) {
    console.error('❌ YouTube API Error:', error.message);
    return false;
  }
};

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add detailed error logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const videoRoutes = require('./routes/videos');

// Use routes
app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/videos', videoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Academic Resource API' });
});

// Modified server startup code
const startServer = async (initialPort) => {
  // Test YouTube API before starting server
  const youtubeAPIWorking = await testYoutubeAPI();
  if (!youtubeAPIWorking) {
    console.error('YouTube API validation failed. Please check your API key.');
    process.exit(1);
  }

  const server = app.listen(initialPort)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${initialPort} is busy, trying ${initialPort + 1}...`);
        server.close();
        startServer(initialPort + 1);
      } else {
        console.error('Server error:', err);
      }
    })
    .on('listening', () => {
      const addr = server.address();
      console.log(`Server is running on port ${addr.port}`);
    });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Server shutdown complete');
      process.exit(0);
    });
  });

  return server;
};

// Replace the existing app.listen with this
const PORT = process.env.PORT || 8080;
startServer(PORT);
