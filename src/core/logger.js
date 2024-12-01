import winston from 'winston';

export class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.File({
          filename: 'src/storage/logs/error.log',
          level: 'error',
          maxFiles: '14d',
          maxsize: '5m',
        }),
        new winston.transports.File({
          filename: 'src/storage/logs/combined.log',
          maxFiles: '14d',
          maxsize: '5m',
        }),
      ],
    });

    if (process.env.NODE_ENV === 'development') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
      );
    }
  }

  debug(message, meta = {}) {
    this.logger.debug(message, { ...meta, timestamp: new Date() });
  }

  info(message, meta = {}) {
    this.logger.info(message, { ...meta, timestamp: new Date() });
  }

  warn(message, meta = {}) {
    this.logger.warn(message, { ...meta, timestamp: new Date() });
  }

  error(message, error = null, meta = {}) {
    const errorMeta = {
      ...meta,
      errorMessage: error?.message,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      timestamp: new Date(),
    };
    this.logger.error(message, errorMeta);
  }
}
