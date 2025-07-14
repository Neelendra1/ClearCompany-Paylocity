const jsonata = require('jsonata');

/**
 * Transforms Paylocity requisition data to ClearCompany format
 * @param {Object} paylocityData - Paylocity requisition data
 * @returns {Object} Transformed ClearCompany data
 */
function transformToClearCompany(paylocityData) {
  try {
    const transformation = jsonata(`
      {
        "requisitionId": requisitionId,
        "title": title,
        "department": department,
        "budget": budget
      }
    `);
    const result = transformation.evaluate(paylocityData);
    logger.info('Transformed Paylocity data to ClearCompany format', { input: paylocityData, output: result });
    return result;
  } catch (error) {
    logger.error('Failed to transform data', { error: error.message, data: paylocityData });
    throw error;
  }
}

module.exports = { transformToClearCompany };