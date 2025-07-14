const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const logger = require('../config/logger');

const PAYLOCITY_API_URL = process.env.PAYLOCITY_API_URL || 'http://localhost:3001/api/v2';
const PAYLOCITY_AUTH_URL = process.env.PAYLOCITY_AUTH_URL || 'http://localhost:3001/IdentityServer/connect/token';
const PAYLOCITY_CLIENT_ID = process.env.PAYLOCITY_CLIENT_ID || 'mock-client-id';
const PAYLOCITY_CLIENT_SECRET = process.env.PAYLOCITY_CLIENT_SECRET || 'mock-client-secret';
const COMPANY_ID = 'mock-company-id';

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => error.response && error.response.status >= 500,
  onRetry: (retryCount, error) => logger.warn(`Retrying getRequisitionData (attempt ${retryCount})`, { error: error.message }),
});

let accessToken = null;

/**
 * Obtains OAuth 2.0 access token from Paylocity
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  try {
    logger.info('Requesting Paylocity access token', { url: PAYLOCITY_AUTH_URL, client_id: PAYLOCITY_CLIENT_ID });
    const response = await axios.post(PAYLOCITY_AUTH_URL, {
      grant_type: 'client_credentials',
      client_id: PAYLOCITY_CLIENT_ID,
      client_secret: PAYLOCITY_CLIENT_SECRET,
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    accessToken = response.data.access_token;
    logger.info('Obtained Paylocity access token', { token: accessToken });
    return accessToken;
  } catch (error) {
    logger.error('Failed to obtain Paylocity access token', { error: error.message, response: error.response?.data });
    throw error;
  }
}

/**
 * Fetches requisition data from Paylocity
 * @returns {Promise<Object>} Requisition data
 */
async function getRequisitionData() {
  try {
    if (!accessToken) {
      await getAccessToken();
    }

    logger.info('Fetching requisition data', { url: `${PAYLOCITY_API_URL}/companies/${COMPANY_ID}/requisitions`, token: accessToken });
    const response = await axios.get(`${PAYLOCITY_API_URL}/companies/${COMPANY_ID}/requisitions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info('Fetched requisition data from Paylocity', { data: response.data });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch requisition data', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    throw error;
  }
}

/**
 * Sends status update to Paylocity
 * @param {Object} data - Status data
 * @returns {Promise<Object>} Response data
 */
async function sendStatusUpdate(data) {
  try {
    if (!accessToken) {
      await getAccessToken();
    }

    const response = await axios.post(`${PAYLOCITY_API_URL}/companies/${COMPANY_ID}/employees`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    logger.info('Successfully sent status update to Paylocity', { response: response.data });
    return response.data;
  } catch (error) {
    logger.error('Failed to send status update to Paylocity', { error: error.message });
    throw error;
  }
}

module.exports = { getRequisitionData, sendStatusUpdate };