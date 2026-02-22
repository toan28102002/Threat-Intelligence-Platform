//LLM-Based Risk Scoring
const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

async function analyzeRisk(threat, likelihood, impact) {
    const prompt = `Analyze the risk score for ${threat} with likelihood ${likelihood} and impact ${impact}.`;
    try {
        const response = await axios.post(API_URL, {
            model: 'gpt-4',
            messages: [{ role: 'system', content: prompt }],
        }, {
            headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error analyzing risk:', error.message);
        return null;
    }
}

module.exports = { analyzeRisk };
