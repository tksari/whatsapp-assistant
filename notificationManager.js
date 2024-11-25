import {TelegramService} from "./telegramService.js";
import {DiscordService} from "./discordService.js";

export class NotificationManager {
    constructor(config) {
        this.service = null;
        this.config = config;

        const channel = this.config.logChannel?.toLowerCase();

        switch (channel) {
            case 'telegram':
                this.service = new TelegramService(
                    this.config.telegram.api,
                    this.config.telegram.token,
                    this.config.telegram.chatId
                );
                break;
            case 'discord':
                this.service = new DiscordService(this.config.discord.webhookUrl);
                break;
            default:
                console.log('Notifications are disabled');
                break;
        }
    }

    async sendMessage(message) {
        if (!this.service) {
            console.log('No notification service configured, skipping message');
            return;
        }
        await this.service.sendMessage(message);
    }

    async sendImage(image, caption) {
        if (!this.service) {
            console.log('No notification service configured, skipping image');
            return;
        }
        await this.service.sendImage(image, caption);
    }
}