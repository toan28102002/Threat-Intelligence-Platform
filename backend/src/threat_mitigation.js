/**
 * Suggests mitigation steps based on threat type.
 * @param {string} threat - Type of security threat detected.
 * @returns {string} - Recommended automated response.
 */
function automatedResponse(threat) {
    const responses = {
        "SQL Injection": "Apply Web Application Firewall (WAF) rules.",
        "Phishing": "Enforce Two-Factor Authentication (2FA) for all users.",
        "DDoS Attack": "Activate rate limiting and implement blackhole routing.",
        "Malware": "Isolate affected systems and perform malware scan.",
        "Brute Force": "Lock affected accounts and enable CAPTCHA protection."
    };

    const response = responses[threat];
    if (response) {
        console.log(`🛡️ Recommended Action for ${threat}: ${response}`);
        return response;
    } else {
        console.warn(`⚠️ No automated response available for: ${threat}`);
        return "Manual review required.";
    }
}

// Example usage
automatedResponse("Phishing");

// Features: Expanded threats, reusable, production-grade logging.
