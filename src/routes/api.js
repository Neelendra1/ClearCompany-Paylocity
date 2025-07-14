const express = require('express');
const router = express.Router();
const clearcompanyService = require('../services/clearcompanyService');
const paylocityService = require('../services/paylocityService');
const transformationService = require('../services/transformationService');
const logger = require('../config/logger');

/**
 * POST /api/jobs - Create or update job in ClearCompany
 */
router.post('/jobs', async (req, res) => {
  try {
    const paylocityData = await paylocityService.getRequisitionData();
    logger.info('Received Paylocity data for job creation', { data: paylocityData });
    const transformedData = transformationService.transformToClearCompany(paylocityData);
    const result = await clearcompanyService.createOrUpdateJob(transformedData);
    res.json(result);
  } catch (error) {
    logger.error('Error in POST /api/jobs', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to create/update job', details: error.message });
  }
});

/**
 * GET /api/jobs/:jobId/status - Get job status
 */
router.get('/jobs/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const status = await clearcompanyService.getJobStatus(jobId);
    res.json(status);
  } catch (error) {
    logger.error('Error in GET /api/jobs/:jobId/status', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to get job status', details: error.message });
  }
});

/**
 * GET /api/candidates/:candidateId - Get candidate details
 */
router.get('/candidates/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const candidate = await clearcompanyService.getCandidate(candidateId);
    res.json(candidate);
  } catch (error) {
    logger.error('Error in GET /api/candidates/:candidateId', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to get candidate', details: error.message });
  }
});

module.exports = router;