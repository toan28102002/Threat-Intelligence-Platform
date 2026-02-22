**OSINT API Research**  
**—**

**Identify three OSINT APIs to integrate into the system**

- Shodan  
- Haveibeenpwned.com  
- Censys

**Research API authentication and request methods**

- **Basic Authentication**: send a username and password with every API call with HTTP header. Simple to implement, and has high compatibility with most systems, but data is not encrypted. Man-in-the-middle attacks can be performed more frequently and easily. Also difficult for users to reset passwords if a combination is compromised.1   
- **API Keys**: A unique ID code that is used to ID users. First time users will need to authenticate for a key. If the key is valid, the user is allowed access and the user is denied access if not. These are more secure as these keys are hard for attackers to guess, but if the attacker does guess, they have full access to applications and data. 1

- **GET:** retrieves data from a resource  
- **POST:** submits data to a resource to create something new  
- **PUT:** updates or replaces a resource with new data  
- **PATCH:** partially updates a resource  
- **DELETE:** removes a resource  
- **TRACE:**  sends the received request back to the client2

[^1] 

[^1]:  **Common API Authentication Methods: Use Cases and Benefits:** [https://konghq.com/blog/engineering/common-api-authentication-methods](https://konghq.com/blog/engineering/common-api-authentication-methods)