const NodeCache = require('node-cache');
const logger = require('../config/logger');

const cache = new NodeCache({ stdTTL: 600 });

/**
 * Creates or updates a job in ClearCompany (mocked)
 * @param {Object} jobData - Job data
 * @returns {Promise<Object>} Job creation result
 */
async function createOrUpdateJob(jobData) {
  try {
    // Mock ClearCompany API response
    const result = {
      jobId: jobData.requisitionId || 'REQ001',
      status: 'Created',
    };
    cache.set(`job:${result.jobId}`, result);
    logger.info('Created/Updated job in ClearCompany (mock)', { jobData });
    return result;
  } catch (error) {
    logger.error('Failed to create/update job', { error: error.message });
    throw error;
  }
}

/**
 * Gets job status from ClearCompany (mocked)
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} Job status
 */
async function getJobStatus(jobId) {
  try {
    const cached = cache.get(`job:${jobId}`);
    if (cached) {
      logger.info('Retrieved job status from cache (mock)', { jobId });
      return cached;
    }
    const result = { jobId, status: 'Open' };
    cache.set(`job:${jobId}`, result);
    logger.info('Retrieved job status from ClearCompany (mock)', { jobId });
    return result;
  } catch (error) {
    logger.error('Failed to get job status', { error: error.message });
    throw error;
  }
}

/**
 * Gets candidate details from ClearCompany (mocked)
 * @param {string} candidateId - Candidate ID
 * @returns {Promise<Object>} Candidate data
 */
async function getCandidate(candidateId) {
  try {
    const result = {
      candidateId,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      status: 'Active',
    };
    logger.info('Retrieved candidate from ClearCompany (mock)', { candidateId });
    return result;
  } catch (error) {
    logger.error('Failed to get candidate', { error: error.message });
    throw error;
  }
}

module.exports = { createOrUpdateJob, getJobStatus, getCandidate };