import { MESSAGE_TYPE, MESSAGE_END_TYPE } from '../constants/messageConstants.js';

export class MessageValidator {
  constructor({ logger, whatsAppUtils }) {
    this.logger = logger;
    this.utils = whatsAppUtils;
    this.messageEndType = MESSAGE_END_TYPE;
    this.messageType = MESSAGE_TYPE;
  }

  validateMessage(message) {
    try {
      if (!message?.body) {
        this.logger.debug('Message skipped: body is missing');
        return false;
      }

      const hasValidType = Object.values(this.messageEndType).some((type) => message.from?.endsWith(type));

      return message.isNewMsg || hasValidType;
    } catch (error) {
      this.logger.error('Message validation failed', error);
      return false;
    }
  }

  getMessageType(message) {
    if (!message) return this.messageType.UNKNOWN;
    return message?.author ? this.messageType.GROUP : this.messageType.DIRECT;
  }

  canUseAI(message, settings, allowedNumbers) {
    const author = message?.author || message?.from;
    const isAllowed = settings?.ai_public_access || this.utils.phone.includesNumber(allowedNumbers, author);

    if (!isAllowed) {
      return false;
    }

    if (this.getMessageType(message) === this.messageType.GROUP) {
      return this.#validateGroupMention(message);
    }

    return true;
  }

  #validateGroupMention(message) {
    try {
      const wasMentioned = message.mentionedIds?.includes(message.to);
      if (message.mentionedIds.length === 1 && wasMentioned) {
        return true;
      }

      this.logger.debug('Bot was not mentioned in the group message');
      return false;
    } catch (error) {
      this.logger.error('Group mention validation failed', error);
      return false;
    }
  }
}
