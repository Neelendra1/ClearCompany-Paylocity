const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const transformationService = require('../services/transformationService');
const paylocityService = require('../services/paylocityService');

/**
 * Webhook endpoint for ClearCompany status updates
 * @route POST /webhooks/status
 * @param {Object} req.body - ClearCompany status data
 * @returns {Object} JSON response indicating success or failure
 */
router.post('/status', async (req, res) => {
  try {
    const clearCompanyData = req.body;
    logger.info('Received ClearCompany webhook', { data: clearCompanyData });
    const transformedData = transformationService.transformToPaylocity(clearCompanyData);
    await paylocityService.sendStatusUpdate(transformedData);
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    logger.error('Failed to process webhook', { error: error.message });
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

module.exports = router;