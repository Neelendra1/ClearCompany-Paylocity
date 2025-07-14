ClearCompany-Paylocity PoC
Overview
Proof of Concept for integrating ClearCompany ATS with Paylocity Headcount Planning Tool using a headless Node.js architecture.
Setup

Install Node.js and npm.
Run npm install to install dependencies.
Create a .env file with:CLEARCOMPANY_API_KEY=your_clearcompany_api_key
PAYLOCITY_API_KEY=mock_paylocity_api_key
NGROK_URL=https://your-ngrok-id.ngrok.io
PORT=3000


Run npm start to start the server.
Use ngrok to expose the server for webhook testing: ngrok http 3000.
Test APIs with Postman or the provided UI at http://localhost:3000.

Testing
Run npm test to execute unit tests with Jest.