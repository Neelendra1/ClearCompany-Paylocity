const transformationService = require('../src/services/transformationService');

describe('Transformation Service', () => {
  beforeAll(async () => {
    // Ensure any async setup is complete
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  /**
   * Test transformToClearCompany
   */
  describe('transformToClearCompany', () => {
    test('should transform Paylocity requisition data to ClearCompany format', () => {
      const paylocityData = {
        requisitionId: 'REQ001',
        title: 'Software Engineer',
        department: 'Engineering',
        budget: 100000,
      };

      const expectedOutput = {
        jobId: 'REQ001',
        job_template: 'Software Engineer',
        category: 'Engineering',
        custom_fields: { budget: '100000' },
      };

      const result = transformationService.transformToClearCompany(paylocityData);

      expect(result).toEqual(expectedOutput);
    });

    test('should handle missing fields gracefully', () => {
      const paylocityData = {
        requisitionId: 'REQ002',
        title: 'Product Manager',
      };

      const expectedOutput = {
        jobId: 'REQ002',
        job_template: 'Product Manager',
        category: undefined,
        custom_fields: { budget: undefined },
      };

      const result = transformationService.transformToClearCompany(paylocityData);

      expect(result).toEqual(expectedOutput);
    });

    test('should handle empty input', () => {
      const paylocityData = {};

      const expectedOutput = {};

      const result = transformationService.transformToClearCompany(paylocityData);

      expect(result).toEqual(expectedOutput);
    });
  });

  /**
   * Test transformToPaylocity
   */
  describe('transformToPaylocity', () => {
    test('should transform ClearCompany status data to Paylocity format', () => {
      const clearCompanyData = {
        jobId: '12345',
        status: 'Open',
      };

      const expectedOutput = {
        jobId: '12345',
        status: 'open',
      };

      const result = transformationService.transformToPaylocity(clearCompanyData);

      expect(result).toEqual(expectedOutput);
    });

    test('should handle missing status field', () => {
      const clearCompanyData = {
        jobId: '12345',
      };

      const expectedOutput = {
        jobId: '12345',
        status: undefined,
      };

      const result = transformationService.transformToPaylocity(clearCompanyData);

      expect(result).toEqual(expectedOutput);
    });

    test('should handle empty input', () => {
      const clearCompanyData = {};

      const expectedOutput = {};

      const result = transformationService.transformToPaylocity(clearCompanyData);

      expect(result).toEqual(expectedOutput);
    });
  });
});