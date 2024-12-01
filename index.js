import { createApplication } from './src/app.js';
import { Logger } from './src/core/logger.js';

let app = null;
let logger = null;

const initLogger = () => {
  if (!logger) {
    logger = new Logger();
  }
  return logger;
};

async function handleShutdown(signal, error = null) {
  logger.warn(`Received ${signal}, initiating graceful shutdown...`);
  if (error) {
    logger.error(`${error}`);
  }

  try {
    if (app) {
      await app.shutdown();
    }
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  await handleShutdown('SIGTERM');
});

process.on('SIGINT', async () => {
  await handleShutdown('SIGINT');
});

process.on('uncaughtException', async (error) => {
  await handleShutdown('UNCAUGHT_EXCEPTION', error);
});

process.on('unhandledRejection', async (reason) => {
  await handleShutdown('UNHANDLED_REJECTION', reason);
});

async function main() {
  try {
    logger = initLogger();
    logger.info('Starting App...');

    app = await createApplication();

    setInterval(
      () => {
        const status = app.getStatus();
        logger.debug('App Status:', status);
      },
      5 * 60 * 1000
    );

    logger.info('App is running');
  } catch (error) {
    logger.error('Fatal error during startup:', error);
    process.exit(1);
  }
}

main();
