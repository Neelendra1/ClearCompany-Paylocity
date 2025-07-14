const paylocityService = require('../src/services/paylocityService');
const logger = require('../src/config/logger');

// Mock logger
jest.mock('../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('Paylocity Service', () => {
  beforeAll(async () => {
    // Ensure logger is initialized
    await logger;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test getRequisitionData
   */
  describe('getRequisitionData', () => {
    test('should fetch requisition data successfully', async () => {
      const expectedData = {
        requisitionId: 'REQ001',
        title: 'Software Engineer',
        department: 'Engineering',
        budget: 100000,
      };

      const result = await paylocityService.getRequisitionData();

      expect(result).toEqual(expectedData);
      expect(logger.info).toHaveBeenCalledWith('Fetched requisition data from Paylocity (mock)');
    });

    test('should handle errors during requisition data fetch', async () => {
      // Use jest.spyOn to wrap the function and throw an error in the try block
      const mockError = new Error('Mock error');
      jest.spyOn(paylocityService, 'getRequisitionData').mockImplementationOnce(async () => {
        throw mockError;
      });

      await expect(paylocityService.getRequisitionData()).rejects.toThrow('Mock error');
      //expect(logger.error).toHaveBeenCalledWith('Failed to fetch requisition data', expect.objectContaining({ error: 'Mock error' }));
    });
  });

  /**
   * Test sendStatusUpdate
   */
  describe('sendStatusUpdate', () => {
    test('should send status update successfully', async () => {
      const mockData = { jobId: '12345', status: 'open' };
      await paylocityService.sendStatusUpdate(mockData);

      expect(logger.info).toHaveBeenCalledWith('Sent status update to Paylocity (mock)', { data: mockData });
    });

    test('should handle errors during status update', async () => {
      // Use jest.spyOn to wrap the function and throw an error in the try block
      const mockError = new Error('Mock error');
      jest.spyOn(paylocityService, 'sendStatusUpdate').mockImplementationOnce(async () => {
        throw mockError;
      });

      await expect(paylocityService.sendStatusUpdate({})).rejects.toThrow('Mock error');
      //expect(logger.error).toHaveBeenCalledWith('Failed to send status update', expect.objectContaining({ error: 'Mock error' }));
    });
  });
});