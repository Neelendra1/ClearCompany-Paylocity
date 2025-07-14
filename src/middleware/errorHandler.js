const logger = require('../config/logger');

  function errorHandler(err, req, res, next) {
    logger.error('Unhandled error', { error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }

  module.exports = errorHandler;