ClearCompany-Paylocity PoC
This is a Proof of Concept (PoC) application demonstrating integration between ClearCompany and Paylocity Web Services. It simulates job creation, status updates, candidate management, and webhooks using a mock Paylocity server and a minimal Express-based backend with a Bootstrap-styled UI.
Features

API Endpoints:

POST /api/jobs: Creates or updates a job in ClearCompany using Paylocity requisition data.
GET /api/jobs/:jobId/status: Retrieves the status of a job.
GET /api/candidates/:candidateId: Fetches candidate details.
POST /webhooks/status: Processes status updates via webhooks, simulating Paylocity employee data submission.


Mock Paylocity Server:

Runs locally to simulate Paylocity Web Services API (OAuth 2.0 and requisition/employee endpoints).
Configurable via environment variables.


UI:

Bootstrap 5-based interface for testing endpoints.
Responsive design with buttons for each API call and a response display area.


Logging:

Uses SQLite (logs.db) with Winston for persistent, queryable logs.
Supports debugging and auditing.


Security:

Implements Content Security Policy (CSP) via Helmet to prevent XSS.
Excludes sensitive data (e.g., .env) from version control.



Prerequisites

Node.js: v20.x (LTS) or v22.13.0
npm: v9.x or later
SQLite: For log storage (install via sqlite.org)
Git: For version control

Installation

Clone the Repository:
git clone https://github.com/yourusername/clearcompany-paylocity-poc.git
cd clearcompany-paylocity-poc


Install Dependencies:
npm install


Set Up Environment Variables:

Create a .env file in the root directory with the following content:PORT=3000
CLEARCOMPANY_API_KEY=mock-clearcompany-key
PAYLOCITY_API_KEY=mock-paylocity-key
PAYLOCITY_API_URL=http://localhost:3001/api/v2
PAYLOCITY_AUTH_URL=http://localhost:3001/IdentityServer/connect/token
PAYLOCITY_CLIENT_ID=mock-client-id
PAYLOCITY_CLIENT_SECRET=mock-client-secret
DATABASE_PATH=./logs.db
MOCK_PORT=3001

Note: Do not commit .env to Git; use .env.example as a template.

Verify SQLite:

Ensure SQLite is installed and accessible:sqlite3 --version

Running the Application

Start the Mock Paylocity Server:

In one terminal:node mock-paylocity-server.js

Expected output: info: Mock Paylocity server running on port 3001


Start the Main Application:

In another terminal:npm start

Expected output: info: Server running on port 3000

Access the UI:

Open http://localhost:3000 in a browser.
Click buttons ("Create Job", "Get Job Status", "Get Candidate", "Test Webhook") to test endpoints.
Responses appear in the card below the buttons.


Testing

Unit Tests:

Run tests with:npm test

Coverage is tracked (currently ~82.92% for services).


API Testing:

Use curl or Postman:curl -X POST http://localhost:3000/api/jobs
curl http://localhost:3000/api/jobs/12345/status
curl http://localhost:3000/api/candidates/67890
curl -X POST http://localhost:3000/webhooks/status -H "Content-Type: application/json" -d '{"jobId": "12345", "status": "Open"}'


Debugging

Check Logs:

Query logs.db with SQLite:sqlite3 logs.db
SELECT * FROM logs WHERE level='error' ORDER BY timestamp DESC;
.exit


Or use DB Browser for SQLite for a GUI interface.


Browser Console:

Open Developer Tools (F12) in the browser to view JavaScript errors or network issues.


Deployment (Optional)

Heroku:
Install Heroku CLI and log in.
Create a Heroku app: heroku create clearcompany-paylocity-poc
Push code: git push heroku master
Set environment variables via Heroku Dashboard or CLI.
Scale dynos: heroku ps:scale web=1

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature-name
Commit changes: git commit -m "Description"
Push to the branch: git push origin feature-name
Open a Pull Request.

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgements

Built with Express.js, Bootstrap, and SQLite.
