const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const security = require('./middleware/security');
const apiRoutes = require('./routes/api');
const webhookRoutes = require('./routes/webhooks');

dotenv.config();
const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(express.json());
app.use(security);
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', apiRoutes);
app.use('/webhooks', webhookRoutes);

// Minimal UI for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;