const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../srv.env') });
console.log("OPENAI_API_KEY from .env:", process.env.OPENAI_API_KEY);
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Import centralized environment variables
const env = require('./config/env');

// Import centralized database connection
const db = require('./database/db');

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

/**
 * Predicts potential next steps based on a security threat description using GPT-4.
 * This route handles POST requests to /api/analyze-threat
 */
router.post("/analyze-threat", async (req, res) => {
    const { description } = req.body;

    if (!description || typeof description !== "string") {
        return res.status(400).json({ error: "Invalid threat description." });
    }

    const prompt = `You are a cybersecurity expert. Analyze this security threat and predict the most likely next attack vectors or steps:\n\n"${description}"`;

    try {
        // Call OpenAI API to generate analysis
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Use GPT-3.5 for analysis
            messages: [
                { role: "system", content: "You are an expert in cybersecurity threat analysis." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        const result = completion.choices[0].message.content.trim();

        // Insert threat description and analysis into SQLite
        const query = `INSERT INTO threat_analysis (description, analysis) VALUES (?, ?)`;
        const params = [description, result];

        db.run(query, params, function (err) {
            if (err) {
                console.error("Error storing threat analysis in database:", err.message);
                return res.status(500).json({ error: "Failed to store analysis." });
            }

            // Respond with the analysis result
            res.json({ analysis: result });
        });
    } catch (err) {
        console.error("❌ OpenAI error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to generate analysis." });
    }
});

module.exports = router;

