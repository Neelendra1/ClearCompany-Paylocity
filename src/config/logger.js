const winston = require('winston');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { format } = winston;
const initDb = require('./db');

// Custom SQLite Transport
class SQLiteTransport extends winston.Transport {
  constructor(options) {
    super(options);
    this.db = null;
    this.dbPath = options.dbPath || './logs.db';
  }

  async initialize() {
    if (!this.db) {
      this.db = await initDb();
    }
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    this.initialize().then(() => {
      const { timestamp, level, message, ...meta } = info;
      this.db.run(
        `INSERT INTO logs (timestamp, level, message, meta) VALUES (?, ?, ?, ?)`,
        [timestamp, level, message, JSON.stringify(meta)],
        (err) => {
          if (err) {
            console.error('SQLite log error:', err);
          }
          callback();
        }
      );
    }).catch((err) => {
      console.error('SQLite init error:', err);
      callback();
    });
  }
}

// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new SQLiteTransport({
      dbPath: process.env.DATABASE_PATH || path.join(__dirname, '../../logs.db'),
    }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    })
  );
}

module.exports = logger;