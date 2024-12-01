import { asClass, asFunction, asValue } from 'awilix';
import { Logger } from '../core/logger.js';
import config from '../config.js';
import { HttpClientService } from '../services/core/httpClientService.js';
import { ServiceProvider } from './serviceProvider.js';
import { WhatsAppMessageService } from '../services/message/whatsAppMessageService.js';
import { MessageHandlerService } from '../services/message/messageHandlerService.js';
import { CommandService } from '../services/core/commandService.js';
import { MessageNotificationService } from '../services/notification/messageNotificationService.js';
import { SettingsService } from '../services/settingsService.js';
import { WhatsAppManager } from '../managers/whatsAppManager.js';
import { MessageValidator } from '../validators/messageValidator.js';
import { WhatsAppUtils } from '../utils/whatsAppUtils.js';
import { NotificationServiceProvider } from './notificationServiceProvider.js';
import { SettingRepository } from '../repositories/settingRepository.js';
import { TemplateService } from '../services/core/templateService.js';
import { AIServiceFactory } from '../factories/aiServiceFactory.js';
import { AIService } from '../services/ai/aiServices.js';
import { WhatsAppClientFactory } from '../factories/whatsAppClientFactory.js';

export class AppServiceProvider extends ServiceProvider {
  providers = [new NotificationServiceProvider(this.container)];

  async register() {
    this.registerConfigs();
    this.registerRepositories();
    this.registerProviders();
    this.providers.forEach((provider) => provider.register());
    this.registerFactories();
    this.registerManagers();
    this.registerServices();
    this.registerUtils();
  }

  registerConfigs() {
    this.container.register({
      config: asValue(config),
      logger: asClass(Logger).singleton(),
    });
  }

  registerProviders() {
    this.container.register({
      aiService: asClass(AIService).singleton(),
    });
  }

  registerFactories() {
    this.container.register({
      whatsAppClient: asFunction(({ logger, config }) => {
        logger.debug('Creating WhatsApp client...');
        return WhatsAppClientFactory.createClient(config);
      }).singleton(),
      aiProvider: asFunction(({ config, logger }) => {
        const factory = new AIServiceFactory(config, logger);
        return factory.createService();
      }).singleton(),
    });
  }

  registerManagers() {
    this.container.register({
      whatsAppManager: asClass(WhatsAppManager).singleton(),
    });
  }

  registerRepositories() {
    this.container.register({
      settingRepository: asClass(SettingRepository).singleton(),
    });
  }

  registerServices() {
    this.container.register({
      httpClientService: asClass(HttpClientService).singleton(),
      whatsAppMessageService: asClass(WhatsAppMessageService).singleton(),
      messageHandlerService: asClass(MessageHandlerService).singleton(),
      commandService: asClass(CommandService).singleton(),
      messageNotificationService: asClass(MessageNotificationService).singleton(),
      settingsService: asClass(SettingsService).singleton(),
      templateService: asClass(TemplateService).singleton(),
    });
  }

  registerUtils() {
    this.container.register({
      messageValidator: asClass(MessageValidator).singleton(),
      whatsAppUtils: asClass(WhatsAppUtils).singleton(),
    });
  }

  async boot() {
    await Promise.all(this.providers.map((provider) => provider.boot()));

    const settingRepository = this.container.resolve('settingRepository');
    await settingRepository.initialize();

    const templateService = this.container.resolve('templateService');
    await templateService.initialize();

    const whatsAppManager = this.container.resolve('whatsAppManager');
    await whatsAppManager.initialize();
  }
}
