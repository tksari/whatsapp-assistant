import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();

export class SettingRepository {
  constructor({ logger }) {
    this.db = null;
    this.logger = logger;
  }

  async initialize() {
    this.logger.info('Initializing database...');

    return new Promise((resolve, reject) => {
      this.db = new sqlite.Database('./src/storage/db/settings.db', (err) => {
        if (err) {
          console.error('Error opening database', err.message);
          reject(err);
          return;
        }

        this.logger.info('Database connected successfully.');

        this.createTables()
          .then(() => {
            this.logger.info('Tables created successfully');
            resolve();
          })
          .catch((error) => {
            this.logger.error('Error creating tables:', error);
            reject(error);
          });
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db
          .run(
            `
                    CREATE TABLE IF NOT EXISTS settings
                    (
                        key
                            TEXT
                            PRIMARY
                                KEY,
                        value
                            BOOLEAN
                            DEFAULT
                                false,
                        value_text
                            TEXT,
                        updated_at
                            DATETIME
                            DEFAULT
                                CURRENT_TIMESTAMP
                    )
                `
          )
          .run(
            `
                        CREATE TABLE IF NOT EXISTS allowed_numbers
                        (
                            phone_number
                                TEXT
                                PRIMARY
                                    KEY,
                            added_at
                                DATETIME
                                DEFAULT
                                    CURRENT_TIMESTAMP,
                            added_by
                                TEXT,
                            notes
                                TEXT
                        )
                    `
          )
          .run(
            `
                        INSERT
                            OR IGNORE
                        INTO settings (key, value, value_text)
                        VALUES ('ai_public_access', false, NULL)
                    `
          )
          .run(
            `
                        INSERT
                            OR IGNORE
                        INTO settings (key, value, value_text)
                        VALUES ('auto_reply', false, NULL)
                    `
          )
          .run(
            `
                        INSERT
                            OR IGNORE
                        INTO settings (key, value, value_text)
                        VALUES ('auto_reply_message', true, 'Thanks for your message. I will get back to you soon.')
                    `,
            [],
            (err) => {
              if (err) {
                this.logger.error('Error creating tables', { error: err });
                reject(err);
              } else {
                this.logger.info('Tables created successfully');
                resolve();
              }
            }
          );
      });
    });
  }

  async addAllowedNumbers(phoneNumbers, addedBy = 'system') {
    return new Promise((resolve, reject) => {
      const placeholders = phoneNumbers.map(() => '(?, ?, ?, CURRENT_TIMESTAMP)').join(',');

      const values = phoneNumbers.reduce((arr, number) => {
        return [...arr, number, addedBy, ''];
      }, []);

      const query = `
                INSERT
                    OR
                REPLACE
                INTO allowed_numbers
                    (phone_number, added_by, notes, added_at)
                VALUES ${placeholders}
            `;

      this.db.run(query, values, (err) => {
        if (err) {
          console.error('Error adding numbers:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async removeAllowedNumbers(phoneNumbers) {
    return new Promise((resolve, reject) => {
      const placeholders = phoneNumbers.map(() => '?').join(',');

      this.db.run(
        `DELETE
                 FROM allowed_numbers
                 WHERE phone_number IN (${placeholders})`,
        phoneNumbers,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async removeAllNumbers() {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM allowed_numbers', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async getAllowedNumbers() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT phone_number FROM allowed_numbers ORDER BY added_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map((row) => row.phone_number));
      });
    });
  }

  async isNumberAllowed(phoneNumber) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT 1 FROM allowed_numbers WHERE phone_number = ?', [phoneNumber], (err, row) => {
        if (err) reject(err);
        else resolve(!!row);
      });
    });
  }

  async getSetting(key) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT value FROM settings WHERE key = ?', [key], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.value : false);
      });
    });
  }

  async upsertSettings(key, value, valueText = null) {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO settings (key, value, value_text, updated_at)
                 VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                 ON CONFLICT(key) DO UPDATE SET value      = excluded.value,
                                                value_text = COALESCE(excluded.value_text, value_text),
                                                updated_at = CURRENT_TIMESTAMP`,
        [key, value, valueText],
        (err) => {
          if (err) {
            this.logger.error('Error:', err.message);
            reject(err);
          } else {
            this.logger.info('Settings updated successfully');
            resolve();
          }
        }
      );
    });
  }

  getAllSettings = async () => {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM settings', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  async getSettingByKey(key) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT value_text FROM settings WHERE key = ?', [key], (err, row) => {
        if (err) reject(err);
        else resolve(row?.value_text);
      });
    });
  }
}
