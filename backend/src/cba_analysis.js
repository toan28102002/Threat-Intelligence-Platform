const db = require('../db/db'); // Adjust path to your shared db.js

/**
 * Creates the cba_results table if it doesn't exist.
 */
function createCbaResultsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS cba_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ale_prior REAL NOT NULL,
            ale_post REAL NOT NULL,
            acs REAL NOT NULL,
            cba_result REAL NOT NULL,
            calculation_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(query, (err) => {
        if (err) {
            console.error("❌ Error creating table:", err.message);
        } else {
            console.log("✅ CBA Results table created or already exists.");
        }
    });
}

/**
 * Logs the CBA result into the SQLite database.
 * @param {number} alePrior - Annual Loss Expectancy before mitigation
 * @param {number} alePost - Annual Loss Expectancy after mitigation
 * @param {number} acs - Annual Cost of Security
 * @param {number} cbaResult - The calculated CBA result
 */
function logCbaResult(alePrior, alePost, acs, cbaResult) {
    const query = `
        INSERT INTO cba_results (ale_prior, ale_post, acs, cba_result)
        VALUES (?, ?, ?, ?)
    `;
    db.run(query, [alePrior, alePost, acs, cbaResult], function (err) {
        if (err) {
            console.error("❌ Error logging CBA result:", err.message);
        } else {
            console.log("✅ CBA result logged to database.");
        }
    });
}

/**
 * Calculates the Cost-Benefit Analysis (CBA) result.
 * 
 * Formula: CBA = (ALE_prior - ALE_post) - ACS
 * Returns a number: positive means savings, negative means loss
 */
function calculateCBA(alePrior, alePost, acs) {
    return (alePrior - alePost) - acs;
}

module.exports = {
    createCbaResultsTable,
    logCbaResult,
    calculateCBA
};
