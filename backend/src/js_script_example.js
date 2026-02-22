async function checkEmail() {
    const email = document.getElementById('email').value;
    const resultDiv = document.getElementById('result');
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'YourAppName/1.0', // replace with your app name or identifier
                'hibp-api-key': 'your-api-key'  // Replace with your Have I Been Pwned API key
            }
        });

        if (response.status === 200) {
            const breaches = await response.json(); // Parse JSON response if the email is pwned
            if (breaches.length > 0) {
                resultDiv.innerHTML = `Email ${email} has been pwned in ${breaches.length} breach${breaches.length > 1 ? 'es' : ''}`;
            } else {
                resultDiv.innerHTML = `Email ${email} hasn't been pwned`;
            }
        } else if (response.status === 404) {
            resultDiv.innerHTML = `Email ${email} hasn't been pwned`;
        } else {
            resultDiv.innerHTML = `Error: ${response.status}`; // Handle other responses
        }
    } catch (error) {
        console.error("Error checking email:", error);
        resultDiv.innerHTML = "An error occurred. Please try again later.";
    }
}
