const AcademicPaper = require('../models/AcademicPaper');
const Project = require('../models/Project');
const axios = require('axios');
require('dotenv').config();

const CORE_API_KEY = process.env.CORE_API_KEY;
const CORE_API_URL = 'https://api.core.ac.uk/v3/search/works/';

/**
 * Fetch papers from CORE API by keywords and save to DB, associating with project
 */
exports.addAcademicPapers = async (req, res) => {
  try {
    const { keywords } = req.body;
    const { projectId } = req.params;
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ message: 'Keywords are required.' });
    }
    const query = keywords.join(' ');

    // Fetch from CORE API
    const response = await axios.get(CORE_API_URL, {
      params: { q: query },
      headers: { 'Authorization': `Bearer ${CORE_API_KEY}` }
    });
    const papers = response.data?.results || [];

    // Save papers to DB, associate with project
    const savedPapers = await Promise.all(papers.map(async (paper) => {
      // Transform authors: array of objects -> array of strings (names)
      let authorNames = [];
      if (Array.isArray(paper.authors)) {
        authorNames = paper.authors.map(a => typeof a === 'string' ? a : (a.name || a.family || a.given || JSON.stringify(a)));
      }
      const doc = {
        pid: projectId,
        coreId: paper.id,
        title: paper.title,
        authors: authorNames,
        abstract: paper.abstract,
        yearPublished: paper.yearPublished,
        publisher: paper.publisher,
        subjects: paper.subjects || [],
        language: typeof paper.language === 'object' && paper.language !== null ? (paper.language.name || paper.language.code || JSON.stringify(paper.language)) : paper.language,
        downloadUrl: paper.downloadUrl,
        sourceUrl: paper.sourceUrl,
        journal: paper.journal,
        doi: paper.doi,
        url: paper.url,
        tags: paper.topics || [],
        fetched_from: 'CORE API'
      };
      // Upsert to avoid duplicates
      return AcademicPaper.findOneAndUpdate(
        { coreId: paper.id, pid: projectId },
        doc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }));

    // Optionally, add references to project
    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { academicPapers: { $each: savedPapers.map(p => p._id) } }
    });

    res.status(201).json({ papers: savedPapers, total: savedPapers.length });
  } catch (error) {
    console.error('Error adding academic papers:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/academic-papers/project/:projectId
exports.getPapersByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const papers = await AcademicPaper.find({ pid: projectId }).sort({ yearPublished: -1, title: 1 });
    res.json({ papers });
  } catch (error) {
    console.error('Error fetching academic papers:', error);
    res.status(500).json({ message: error.message });
  }
};
