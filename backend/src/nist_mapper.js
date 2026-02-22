
/**
 * Maps threat to corresponding NIST incident handling phase.
 * @param {Object} threat - The threat object
 * @returns {string} - The NIST phase
 */
function mapThreatToNIST(threat) {
    if (threat.detected && !threat.mitigated) {
        return "Detection & Analysis";
    } else if (threat.mitigated && !threat.recovered) {
        return "Containment, Eradication, Recovery";
    } else if (threat.recovered) {
        return "Post-Incident Activity";
    } else {
        return "Preparation";
    }
}

// Example
const threat = {
    ip: "10.1.2.3",
    riskScore: 40,
    detected: true,
    mitigated: true,
    recovered: false
};

console.log(`Mapped to NIST Phase: ${mapThreatToNIST(threat)}`);

// Git Commit Message
//Linked threat lifecycle to NIST SP 800-61 Rev. 2 incident phases in /src/nist_mapper.js

