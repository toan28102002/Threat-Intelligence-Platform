// Function to calculate risk score
function calculateRisk(likelihood, impact) {
    return likelihood * impact; // Simple multiplication to calculate risk
}

// Function to dynamically assign Likelihood and Impact
// For example, these values could be fetched or adjusted based on various factors
function getDynamicLikelihoodAndImpact(threat) {
    // Example of dynamic logic for Likelihood and Impact based on threat type
    let likelihood = 0;
    let impact = 0;

    switch (threat) {
        case "SQL Injection":
            likelihood = 4;
            impact = 5;
            break;
        case "Phishing Attack":
            likelihood = 5;
            impact = 3;
            break;
        case "Cross-Site Scripting (XSS)":
            likelihood = 3;
            impact = 4;
            break;
        default:
            likelihood = 2;
            impact = 2;
    }

    return { likelihood, impact };
}

// Function to assess the risk for a set of threats
function assessThreatRisks(threats) {
    return threats.map(threat => {
        // Get dynamic likelihood and impact based on the threat
        const { likelihood, impact } = getDynamicLikelihoodAndImpact(threat.threat);
        // Calculate the risk score
        const riskScore = calculateRisk(likelihood, impact);

        return {
            ...threat,
            likelihood,
            impact,
            risk_score: riskScore
        };
    });
}

// Export functions to use in other parts of the application
module.exports = { assessThreatRisks };
