import { asClass, asFunction } from 'awilix';
import { ServiceProvider } from './serviceProvider.js';
import { NotificationFactory } from '../factories/notificationFactory.js';
import { TelegramHttpRepository } from '../repositories/telegramHttpRepository.js';
import { DiscordHttpRepository } from '../repositories/discordHttpRepository.js';
import { TelegramService } from '../services/notification/telegramService.js';
import { DiscordService } from '../services/notification/discordService.js';

export class NotificationServiceProvider extends ServiceProvider {
  register() {
    this.container.register({
      telegramHttpRepository: asClass(TelegramHttpRepository).singleton(),
      discordHttpRepository: asClass(DiscordHttpRepository).singleton(),
    });

    this.container.register({
      telegramService: asClass(TelegramService).singleton(),
      discordService: asClass(DiscordService).singleton(),
    });

    this.container.register({
      notificationFactory: asFunction(NotificationFactory).singleton(),
    });
  }

  boot() {
    const notificationFactory = this.container.resolve('notificationFactory');
    const service = notificationFactory.createService();

    this.container.register({
      notification: asFunction(() => service).singleton(),
    });
  }
}
