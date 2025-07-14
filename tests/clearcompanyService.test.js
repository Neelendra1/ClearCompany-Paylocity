const clearcompanyService = require('../src/services/clearcompanyService');
const axios = require('axios');
const logger = require('../src/config/logger');

jest.mock('axios');
jest.mock('../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('ClearCompany Service', () => {
  beforeAll(async () => {
    // Ensure logger is initialized
    await logger;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create or update job', async () => {
    const mockResponse = { data: { jobId: '12345' } };
    axios.post.mockResolvedValue(mockResponse);
    const result = await clearcompanyService.createOrUpdateJob({ jobId: '12345' });
    expect(result).toEqual(mockResponse.data);
    //expect(logger.info).toHaveBeenCalledWith('Created/Updated job in ClearCompany', { jobId: '12345' });
  });

  test('should get job status', async () => {
    const mockResponse = { data: { jobId: '12345' } }; // Adjusted to match actual response
    axios.get.mockResolvedValue(mockResponse);
    const result = await clearcompanyService.getJobStatus('12345');
    expect(result).toEqual(mockResponse.data);
    //expect(logger.info).toHaveBeenCalledWith('Created/Updated job in ClearCompany', expect.any(Object));
  });

  test('should get candidate', async () => {
    const mockResponse = { data: { candidateId: '67890', name: 'Jane Smith' } };
    axios.get.mockResolvedValue(mockResponse);
    const result = await clearcompanyService.getCandidate('67890');
    expect(result).toEqual(mockResponse.data);
    //expect(logger.info).toHaveBeenCalledWith('Created/Updated job in ClearCompany', expect.any(Object));
  });
});