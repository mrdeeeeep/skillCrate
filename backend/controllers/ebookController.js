const EBook = require('../models/EBook');
const Project = require('../models/Project');
const axios = require('axios');

// Fetch and upsert ebooks from Google Books API
exports.addEBooks = async (req, res) => {
  try {
    const { keywords } = req.body;
    const { projectId } = req.params;
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ message: 'Keywords required' });
    }
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Query Google Books API
    const q = encodeURIComponent(keywords.join(' '));
    const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=10&printType=books`;
    const response = await axios.get(url);
    const books = response.data.items || [];
    const upserted = [];

    for (const item of books) {
      const info = item.volumeInfo || {};
      const doc = {
        pid: projectId,
        googleId: item.id,
        title: info.title,
        authors: info.authors || [],
        description: info.description,
        publisher: info.publisher,
        publishedDate: info.publishedDate,
        categories: info.categories || [],
        language: info.language,
        pageCount: info.pageCount,
        previewLink: info.previewLink,
        infoLink: info.infoLink,
        thumbnail: info.imageLinks?.thumbnail || '',
        tags: info.categories || [],
        fetched_from: 'Google Books'
      };
      const ebook = await EBook.findOneAndUpdate(
        { pid: projectId, googleId: item.id },
        doc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upserted.push(ebook);
    }
    res.status(201).json({ ebooks: upserted });
  } catch (err) {
    console.error('EBook fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch ebooks', error: err.message });
  }
};

// Get ebooks by project
exports.getEBooksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const ebooks = await EBook.find({ pid: projectId }).sort({ publishedDate: -1, title: 1 });
    res.json({ ebooks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get ebooks', error: err.message });
  }
};
