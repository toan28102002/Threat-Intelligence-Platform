// Risk Prioritization Model
function prioritizeRisks(risks) {
    return risks.sort((a, b) => (b.likelihood * b.impact) - (a.likelihood * a.impact));
}

module.exports = { prioritizeRisks };
