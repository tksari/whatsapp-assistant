import { jest } from '@jest/globals';

export const mockSettingsService = {
  upsertSettings: jest.fn(),
  addAllowedNumbers: jest.fn(),
  removeAllNumbers: jest.fn(),
  removeAllowedNumbers: jest.fn(),
  getAllowedNumbers: jest.fn(),
  getAllSettings: jest.fn(),
};

export const mockAiService = {
  generateResponse: jest.fn(),
  generateSummary: jest.fn(),
  generateAnalysis: jest.fn(),
  generateIdeas: jest.fn(),
};

export const mockWhatsAppUtils = {
  phone: {
    cleanMultiple: jest.fn((numbers) => numbers),
    format: jest.fn((num) => num),
  },
  templates: {
    allowedNumbers: jest.fn(),
    settingsStatus: jest.fn(),
  },
};

export const mockTemplateService = {
  getTemplate: jest.fn(),
};
