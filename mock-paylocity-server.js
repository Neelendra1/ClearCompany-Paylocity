const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./src/config/logger');

const app = express();
const PORT = process.env.MOCK_PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mock OAuth 2.0 Token Endpoint
app.post('/IdentityServer/connect/token', (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  if (grant_type !== 'client_credentials' || !client_id || !client_secret) {
    logger.error('Invalid OAuth request', { body: req.body });
    return res.status(400).json({ error: 'Invalid client credentials or grant type' });
  }

  logger.info('Issuing mock Paylocity access token', { client_id });
  res.status(200).json({
    access_token: 'mock-access-token-12345',
    expires_in: 3600,
    token_type: 'Bearer',
  });
});

// Mock Requisition Data Endpoint (for getRequisitionData)
app.get('/api/v2/companies/:companyId/requisitions', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock-access-token-12345')) {
    logger.error('Unauthorized request to requisitions endpoint', { headers: req.headers });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { companyId } = req.params;
  logger.info('Fetching requisition data', { companyId });

  res.status(200).json({
    requisitionId: 'REQ001',
    title: 'Software Engineer',
    department: 'Engineering',
    budget: 100000,
  });
});

// Mock Employee Data Endpoint (for sendStatusUpdate)
app.post('/api/v2/companies/:companyId/employees', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer mock-access-token-12345')) {
    logger.error('Unauthorized request to employee endpoint', { headers: req.headers });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { companyId } = req.params;
  const employeeData = req.body;
  logger.info('Received employee data', { companyId, data: employeeData });

  res.status(201).json({
    employeeId: `EMP${Math.floor(Math.random() * 1000)}`,
    status: 'Created',
    data: employeeData,
  });
});

app.listen(PORT, () => {
  logger.info(`Mock Paylocity server running on port ${PORT}`);
});

module.exports = app;