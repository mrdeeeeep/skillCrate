// coreAPItest.js
require('dotenv').config();
const axios = require('axios');

// Get the core API URL from environment variables
const CORE_API_KEY = process.env.CORE_API_KEY;
const CORE_API_URL = 'https://api.core.ac.uk/v3/search/works/';

if (!CORE_API_KEY) {
    throw new Error('CORE_API_KEY is not defined in your environment variables.');
}

/**
 * Retrieve course metadata using keywords
 * @param {string} keywords - The keywords to search for courses
 * @returns {Promise<Object[]>} - Array of course metadata objects
 */
async function getCourseMetadataByKeywords(keywords) {
    const params = { q: keywords };
    const headers = { 'Authorization': `Bearer ${CORE_API_KEY}` };
    console.log('Requesting:', CORE_API_URL);
    console.log('Params:', params);
    console.log('Headers:', headers);
    try {
        const response = await axios.get(CORE_API_URL, {
            params,
            headers
        });
        return response.data; // Adjust this if your API returns data in a nested structure
    } catch (error) {
        if (error.response) {
            console.error('Error fetching course metadata:');
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        return null;
    }
}

// Example usage:
(async () => {
    const keywords = 'machine learning'; // Simpler keyword for debugging
    const metadata = await getCourseMetadataByKeywords(keywords);
    console.log('Course Metadata:', metadata);
})();
