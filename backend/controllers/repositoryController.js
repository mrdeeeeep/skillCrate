const Repository = require('../models/Repository');
const Project = require('../models/Project');
const axios = require('axios');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Fetch and upsert repositories from GitHub API
exports.addRepositories = async (req, res) => {
  try {
    const { keywords } = req.body;
    const { projectId } = req.params;
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ message: 'Keywords required' });
    }
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Query GitHub API for each keyword (limit to avoid rate limits)
    let allRepos = [];
    for (const keyword of keywords.slice(0, 3)) { // Limit to first 3 keywords
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}&per_page=10`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      allRepos = allRepos.concat(response.data.items || []);
    }
    // Remove duplicates by githubId
    const uniqueRepos = Array.from(new Map(allRepos.map(repo => [repo.id, repo])).values());
    const upserted = [];
    for (const repo of uniqueRepos) {
      const doc = {
        pid: projectId,
        githubId: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || [],
        fetched_from: 'GitHub'
      };
      const repository = await Repository.findOneAndUpdate(
        { pid: projectId, githubId: repo.id },
        doc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upserted.push(repository);
    }
    res.status(201).json({ repositories: upserted });
  } catch (err) {
    console.error('Repository fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch repositories', error: err.message });
  }
};

// Get repositories by project
exports.getRepositoriesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const repositories = await Repository.find({ pid: projectId }).sort({ stars: -1, name: 1 });
    res.json({ repositories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get repositories', error: err.message });
  }
};
