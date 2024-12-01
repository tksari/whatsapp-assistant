export class MessageNotificationService {
  constructor({ notification, templateService }) {
    this.notification = notification;
    this.template = templateService;
  }

  async notifyNewMessage(message) {
    const messageInfo = this.template.formatTemplate('messageInfo', {
      contact: message._data?.notifyName || 'No Name',
      isBusiness: message._data?.isBusiness ? '(Business)' : '',
      from: message.from,
      body: message.body,
      datetime: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    });

    await this.notification.sendMessage(messageInfo);
  }

  async notifyCommandExecution(command, response) {
    await this.notification.sendMessage(`💬 Command: ${command}\n\n🤖 Response: ${response}`.trim());
  }

  async notifyError(message, error) {
    await this.notification.sendMessage(`❌ ${message}:\n${error.message}`);
  }
}
