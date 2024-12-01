import { MessageHandlerService } from '../src/services/message/messageHandlerService.js';
import { MESSAGE_TYPE } from '../src/constants/messageConstants';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  mockSettingsService,
  mockAiService,
  mockMessageNotificationService,
  mockWhatsAppMessageService,
  mockLogger,
  mockMessageValidator,
  mockCommandService,
} from './mocks/messageHandlerMocks.js';

describe('MessageHandlerService', () => {
  let messageHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    messageHandler = new MessageHandlerService({
      settingsService: mockSettingsService,
      aiService: mockAiService,
      messageNotificationService: mockMessageNotificationService,
      whatsAppMessageService: mockWhatsAppMessageService,
      logger: mockLogger,
      messageValidator: mockMessageValidator,
      commandService: mockCommandService,
    });
  });

  describe('handleMessage', () => {
    it('should return null for invalid messages', async () => {
      mockMessageValidator.validateMessage.mockReturnValue(false);
      const message = { body: 'test message' };

      const result = await messageHandler.handleMessage(message);

      expect(result).toBeNull();
      expect(mockMessageValidator.validateMessage).toHaveBeenCalledWith(message);
      expect(mockMessageNotificationService.notifyNewMessage).not.toHaveBeenCalled();
    });

    it('should notify new message and return null for unknown message type', async () => {
      const message = { body: 'test message' };
      mockMessageValidator.validateMessage.mockReturnValue(true);
      mockMessageValidator.getMessageType.mockReturnValue(MESSAGE_TYPE.UNKNOWN);
      mockSettingsService.getFormattedSettings.mockResolvedValue({});

      const result = await messageHandler.handleMessage(message);

      expect(result).toBeNull();
      expect(mockMessageNotificationService.notifyNewMessage).toHaveBeenCalledWith(message);
      expect(mockLogger.debug).toHaveBeenCalledWith('Unknown message type detected');
    });

    it('should handle auto reply for eligible messages', async () => {
      const message = { body: 'test', fromMe: false };
      const settings = {
        auto_reply: true,
        auto_reply_message: 'Auto reply message',
      };

      mockMessageValidator.validateMessage.mockReturnValue(true);
      mockMessageValidator.getMessageType.mockReturnValue(MESSAGE_TYPE.DIRECT);
      mockSettingsService.getFormattedSettings.mockResolvedValue(settings);

      await messageHandler.handleMessage(message);

      expect(mockWhatsAppMessageService.sendAutoReply).toHaveBeenCalledWith(message, settings.auto_reply_message);
    });

    it('should handle AI messages for allowed users', async () => {
      const message = { body: '!ai test', fromMe: false };
      const settings = { auto_reply: false };
      const allowedNumbers = ['1234567890'];

      mockMessageValidator.validateMessage.mockReturnValue(true);
      mockMessageValidator.getMessageType.mockReturnValue(MESSAGE_TYPE.DIRECT);
      mockSettingsService.getFormattedSettings.mockResolvedValue(settings);
      mockSettingsService.getAllowedNumbers.mockResolvedValue(allowedNumbers);
      mockMessageValidator.canUseAI.mockReturnValue(true);

      await messageHandler.handleMessage(message);

      expect(mockCommandService.isValidCommand).toHaveBeenCalledWith(message);
    });
  });

  describe('shouldAutoReply', () => {
    it('should return true when all conditions are met', () => {
      const message = { fromMe: false };
      const settings = { auto_reply: true };

      const result = messageHandler.shouldAutoReply(message, MESSAGE_TYPE.DIRECT, settings);

      expect(result).toBeTruthy();
    });

    it('should return false when message is from self', () => {
      const message = { fromMe: true };
      const settings = { auto_reply: true };

      const result = messageHandler.shouldAutoReply(message, MESSAGE_TYPE.DIRECT, settings);

      expect(result).toBeFalsy();
    });

    it('should return false when auto reply is disabled', () => {
      const message = { fromMe: false };
      const settings = { auto_reply: false };

      const result = messageHandler.shouldAutoReply(message, MESSAGE_TYPE.DIRECT, settings);

      expect(result).toBeFalsy();
    });

    it('should return false for non-direct messages', () => {
      const message = { fromMe: false };
      const settings = { auto_reply: true };

      const result = messageHandler.shouldAutoReply(message, MESSAGE_TYPE.GROUP, settings);

      expect(result).toBeFalsy();
    });
  });

  describe('handleCommand', () => {
    it('should not process invalid commands', async () => {
      const message = { body: 'invalid command' };
      mockCommandService.isValidCommand.mockReturnValue(false);

      await messageHandler.handleCommand(message);

      expect(mockCommandService.executeCommand).not.toHaveBeenCalled();
      expect(mockWhatsAppMessageService.sendMessage).not.toHaveBeenCalled();
    });

    it('should execute valid commands and send response', async () => {
      const message = { body: '!test', from: '1234567890' };
      const response = 'Command executed successfully';

      mockCommandService.isValidCommand.mockReturnValue(true);
      mockCommandService.executeCommand.mockResolvedValue(response);

      await messageHandler.handleCommand(message);

      expect(mockCommandService.executeCommand).toHaveBeenCalledWith(message, false);
      expect(mockWhatsAppMessageService.sendMessage).toHaveBeenCalledWith(message.from, response);
    });

    it('should handle command execution errors', async () => {
      const message = { body: '!test', from: '1234567890' };
      const error = new Error('Command failed');

      mockCommandService.isValidCommand.mockReturnValue(true);
      mockCommandService.executeCommand.mockRejectedValue(error);

      await expect(messageHandler.handleCommand(message)).rejects.toThrow(error);
      expect(mockMessageNotificationService.notifyError).toHaveBeenCalledWith('Command handling error', error);
    });

    it('should handle admin commands correctly', async () => {
      const message = { body: '!admin', from: '1234567890' };
      const response = 'Admin command executed';

      mockCommandService.isValidCommand.mockReturnValue(true);
      mockCommandService.executeCommand.mockResolvedValue(response);

      await messageHandler.handleCommand(message, true);

      expect(mockCommandService.executeCommand).toHaveBeenCalledWith(message, true);
      expect(mockWhatsAppMessageService.sendMessage).toHaveBeenCalledWith(message.from, response);
    });
  });
});
