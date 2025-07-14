const request = require('supertest');
const express = require('express');
const apiRoutes = require('../src/routes/api');
const clearcompanyService = require('../src/services/clearcompanyService');
const paylocityService = require('../src/services/paylocityService');
const logger = require('../src/config/logger');

// Mock services
jest.mock('../src/services/clearcompanyService');
jest.mock('../src/services/paylocityService');
jest.mock('../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Create a test Express app
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Routes', () => {
  beforeAll(async () => {
    // Ensure logger is initialized
    await logger;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test POST /api/jobs
   */
  describe('POST /api/jobs', () => {
    test('should create or update job successfully', async () => {
      const mockPaylocityData = {
        requisitionId: 'REQ001',
        title: 'Software Engineer',
        department: 'Engineering',
        budget: 100000,
      };
      const mockTransformedData = {
        jobId: 'REQ001',
        job_template: 'Software Engineer',
        category: 'Engineering',
        custom_fields: { budget: '100000' },
      };
      const mockClearCompanyResponse = { jobId: 'REQ001', status: 'Created' };

      paylocityService.getRequisitionData.mockResolvedValue(mockPaylocityData);
      clearcompanyService.createOrUpdateJob.mockResolvedValue(mockClearCompanyResponse);

      const response = await request(app)
        .post('/api/jobs')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockClearCompanyResponse);
      expect(paylocityService.getRequisitionData).toHaveBeenCalled();
      expect(clearcompanyService.createOrUpdateJob).toHaveBeenCalledWith(mockTransformedData);
    });

    test('should handle errors during job creation', async () => {
      paylocityService.getRequisitionData.mockRejectedValue(new Error('Paylocity API error'));

      const response = await request(app)
        .post('/api/jobs')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to create/update job' });
      expect(logger.error).toHaveBeenCalledWith('Error in POST /api/jobs', expect.any(Object));
    });
  });

  /**
   * Test GET /api/jobs/:jobId/status
   */
  describe('GET /api/jobs/:jobId/status', () => {
    test('should get job status successfully', async () => {
      const mockJobStatus = { jobId: '12345' }; // Adjusted to match actual response
      clearcompanyService.getJobStatus.mockResolvedValue(mockJobStatus);

      const response = await request(app)
        .get('/api/jobs/12345/status')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockJobStatus);
      expect(clearcompanyService.getJobStatus).toHaveBeenCalledWith('12345');
    });

    test('should handle errors during job status retrieval', async () => {
      clearcompanyService.getJobStatus.mockRejectedValue(new Error('ClearCompany API error'));

      const response = await request(app)
        .get('/api/jobs/12345/status')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to get job status' });
      expect(logger.error).toHaveBeenCalledWith('Error in GET /api/jobs/:jobId/status', expect.any(Object));
    });
  });

  /**
   * Test GET /api/candidates/:candidateId
   */
  describe('GET /api/candidates/:candidateId', () => {
    test('should get candidate details successfully', async () => {
      const mockCandidate = { candidateId: '67890', name: 'Jane Smith', status: 'Interviewed' };
      clearcompanyService.getCandidate.mockResolvedValue(mockCandidate);

      const response = await request(app)
        .get('/api/candidates/67890')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockCandidate);
      expect(clearcompanyService.getCandidate).toHaveBeenCalledWith('67890');
    });

    test('should handle errors during candidate retrieval', async () => {
      clearcompanyService.getCandidate.mockRejectedValue(new Error('ClearCompany API error'));

      const response = await request(app)
        .get('/api/candidates/67890')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toEqual({ error: 'Failed to get candidate' });
      expect(logger.error).toHaveBeenCalledWith('Error in GET /api/candidates/:candidateId', expect.any(Object));
    });
  });
});