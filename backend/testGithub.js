require('dotenv').config();
const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const keyword = process.argv[2] || 'example'; // Accept keyword from command line or default

async function searchRepositories(keyword) {
  try {
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(keyword)}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );
    // Print repository names and metadata
    response.data.items.forEach(repo => {
      console.log({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
      });
    });
  } catch (error) {
    console.error('Error fetching repositories:', error.response?.data || error.message);
  }
}

searchRepositories(keyword);
