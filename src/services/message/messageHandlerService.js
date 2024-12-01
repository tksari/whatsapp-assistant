import { MESSAGE_TYPE } from '../../constants/messageConstants.js';

export class MessageHandlerService {
  constructor({
    settingsService,
    aiService,
    messageNotificationService,
    whatsAppMessageService,
    logger,
    messageValidator,
    commandService,
  }) {
    this.settingsService = settingsService;
    this.aiService = aiService;
    this.messageNotification = messageNotificationService;
    this.whatsAppMessage = whatsAppMessageService;
    this.logger = logger;
    this.messageValidator = messageValidator;
    this.commandService = commandService;
  }

  async handleMessage(message) {
    if (!this.messageValidator.validateMessage(message)) {
      return null;
    }

    await this.messageNotification.notifyNewMessage(message);

    const settings = await this.settingsService.getFormattedSettings();
    const messageType = this.messageValidator.getMessageType(message);

    if (messageType === MESSAGE_TYPE.UNKNOWN) {
      this.logger.debug('Unknown message type detected');
      return null;
    }

    if (this.shouldAutoReply(message, messageType, settings)) {
      await this.whatsAppMessage.sendAutoReply(message, settings?.auto_reply_message);
      return;
    }

    const allowedNumbers = await this.settingsService.getAllowedNumbers();

    if (this.messageValidator.canUseAI(message, settings, allowedNumbers)) {
      this.handleCommand(message, false);
    }
  }

  shouldAutoReply(message, messageType, settings) {
    return settings?.auto_reply && !message.fromMe && messageType === MESSAGE_TYPE.DIRECT;
  }

  async handleCommand(message, isAdmin = false) {
    if (!this.commandService.isValidCommand(message)) {
      return;
    }

    try {
      const response = await this.commandService.executeCommand(message, isAdmin);
      if (response) {
        await this.whatsAppMessage.sendMessage(message.from, response);
        this.messageNotification.notifyCommandExecution(message.body, response);
      }
    } catch (error) {
      await this.messageNotification.notifyError('Command handling error', error);
      throw error;
    }
  }
}
