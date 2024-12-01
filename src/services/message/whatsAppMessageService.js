export class WhatsAppMessageService {
  constructor({ whatsAppClient, logger, messageNotificationService }) {
    this.client = whatsAppClient;
    this.logger = logger;
    this.messageNotification = messageNotificationService;
  }

  async sendMessage(to, message) {
    await this.client.sendMessage(to, message);
    this.logger.info(`Message sent to: ${to} via WhatsApp`);
  }

  async sendAutoReply(message, autoReplyMessage) {
    const preparedMessage = autoReplyMessage || 'Thanks for your message. I will get back to you soon.';
    await this.sendMessage(message.from, preparedMessage);
    await this.messageNotification.notifyNewMessage(`✅ Auto reply sent to: ${message.from}`);
  }
}
