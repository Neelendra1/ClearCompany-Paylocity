const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Initializes SQLite database for logging
 * @returns {Promise<sqlite3.Database>} Database instance
 */
async function initDb() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      path.resolve(process.env.DATABASE_PATH || './logs.db'),
      (err) => {
        if (err) {
          return reject(err);
        }
        db.run(
          `CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            level TEXT,
            message TEXT,
            meta TEXT
          )`,
          (err) => {
            if (err) {
              return reject(err);
            }
            resolve(db);
          }
        );
      }
    );
  });
}

module.exports = initDb;