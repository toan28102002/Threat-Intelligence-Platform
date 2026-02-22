# **Deployment Checklist**

**Project:** Threat Intelligence Dashboard  
**Environment:** Production  
**Last Updated:** 04/23/2025

## **Security:**

- API keys handled in the srv.env file  
- CORS configured for frontend   
- Ports not used are closed

## **Backend:**

- srv.env file set up with required environment variables  
- API error handling implemented  
- SQLite file storage made  
- Load test performed (JMeter)  
- ZAP scan completed (no errors)

## **Frontend:** 

- Built with npm run dev  
- Connected to backend (/api)  
- Tested on localhost:5050  
- Responsive design  
- Error handling implemented 

## **Server:**

- Node.js and SQLite installed  
- Starting on localhost:5050

## **Deployment:**

- Starting server with npm run dev in the …/backend directory  
- Frontend reached at localhost:5050 → run npm run dev in the …/frontend directory  
- Data stored and retrieved from database  
- No critical errors

# **Sign-off:**

Haley Nilsen, Project Manager, 04/23/2025