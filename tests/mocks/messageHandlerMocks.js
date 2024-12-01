import { jest } from '@jest/globals';

export const mockSettingsService = {
  getFormattedSettings: jest.fn(),
  getAllowedNumbers: jest.fn(),
};

export const mockAiService = {
  processMessage: jest.fn(),
};

export const mockMessageNotificationService = {
  notifyNewMessage: jest.fn(),
  notifyError: jest.fn(),
  notifyCommandExecution: jest.fn(),
};

export const mockWhatsAppMessageService = {
  sendAutoReply: jest.fn(),
  sendMessage: jest.fn(),
};

export const mockLogger = {
  debug: jest.fn(),
};

export const mockMessageValidator = {
  validateMessage: jest.fn(),
  getMessageType: jest.fn(),
  canUseAI: jest.fn(),
};

export const mockCommandService = {
  isValidCommand: jest.fn(),
  executeCommand: jest.fn(),
};
