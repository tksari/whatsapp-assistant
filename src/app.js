import { createContainer, InjectionMode } from 'awilix';
import { AppServiceProvider } from './providers/AppServiceProvider.js';

class Application {
  constructor() {
    this.container = null;
    this.whatsAppManager = null;
    this.settingRepository = null;
    this.logger = null;
  }

  async createAppContainer() {
    const container = createContainer({
      injectionMode: InjectionMode.PROXY,
    });

    const appProvider = new AppServiceProvider(container);

    await appProvider.register();
    await appProvider.boot();
    return container;
  }

  async initialize() {
    this.container = await this.createAppContainer();
    this.logger = this.container.resolve('logger');

    this.whatsAppManager = this.container.resolve('whatsAppManager');
    this.settingRepository = this.container.resolve('settingRepository');

    this.logger.info('App initialized successfully');
  }

  async shutdown() {
    this.logger.info('Starting application shutdown...');

    try {
      if (this.whatsAppManager) {
        await this.whatsAppManager.destroy();
        this.whatsAppManager = null;
        this.logger.debug('WhatsApp bot destroyed');
      }

      if (this.settingRepository?.db) {
        await this.settingRepository.db.close();
        this.logger.debug('Database connection closed');
      }

      this.logger.info('Application shutdown completed');
    } catch (error) {
      this.logger.error('Error during shutdown:', error);
      throw error;
    }
  }

  getStatus() {
    const status = {
      whatsAppManager: this.whatsAppManager ? 'running' : 'stopped',
    };
    this.logger.debug('Application status:', status);
    return status;
  }
}

export const createApplication = async () => {
  const app = new Application();
  await app.initialize();
  return app;
};
