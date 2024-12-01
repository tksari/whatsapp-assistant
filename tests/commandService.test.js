import { CommandService } from '../src/services/core/commandService.js';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  mockSettingsService,
  mockAiService,
  mockWhatsAppUtils,
  mockTemplateService,
} from './mocks/commandServiceMocks';

describe('CommandService', () => {
  let commandService;

  beforeEach(() => {
    jest.clearAllMocks();
    commandService = new CommandService({
      settingsService: mockSettingsService,
      aiService: mockAiService,
      whatsAppUtils: mockWhatsAppUtils,
      templateService: mockTemplateService,
    });
  });

  describe('Message Parsing', () => {
    it('should validate commands starting with !', () => {
      expect(commandService.isValidCommand({ body: '!help' })).toBeTruthy();
      expect(commandService.isValidCommand({ body: 'help' })).toBeFalsy();
      expect(commandService.isValidCommand({ body: '' })).toBeFalsy();
      expect(commandService.isValidCommand({})).toBeFalsy();
    });

    it('should parse command and arguments correctly', () => {
      const message = { body: '!command arg1 arg2' };
      const result = commandService.parseMessage(message);
      expect(result).toEqual({
        command: 'command',
        args: ['arg1', 'arg2'],
      });
    });

    it('should handle mentions in commands', () => {
      const message = {
        body: '!command @12345 arg1',
        mentionedIds: ['12345'],
      };
      const result = commandService.parseMessage(message);
      expect(result).toEqual({
        command: 'command',
        args: ['arg1'],
      });
    });
  });

  describe('AI Commands', () => {
    const testCases = [
      {
        command: 'ai',
        method: 'generateResponse',
        text: 'test prompt',
      },
      {
        command: 'sum',
        method: 'generateSummary',
        text: 'test text',
      },
      {
        command: 'analyze',
        method: 'generateAnalysis',
        text: 'analyze this',
      },
      {
        command: 'idea',
        method: 'generateIdeas',
        text: 'generate ideas',
      },
    ];

    testCases.forEach(({ command, method, text }) => {
      it(`should handle ${command} command correctly`, async () => {
        const expectedResponse = `${method} result`;
        mockAiService[method].mockResolvedValue(expectedResponse);

        const result = await commandService.handleAICommand(command, [text]);

        expect(mockAiService[method]).toHaveBeenCalledWith(text, 'en');
        expect(result).toBe(expectedResponse);
      });
    });

    it('should return error for empty AI command input', async () => {
      const result = await commandService.handleAICommand('ai', []);
      expect(result).toBe('❌ Please provide text for the AI command');
    });
  });

  describe('Admin Commands', () => {
    describe('Toggle Commands', () => {
      const toggleTests = [
        {
          type: 'auto',
          settingKey: 'auto_reply',
          successMessage: '✅ Auto reply',
        },
        {
          type: 'ai_public',
          settingKey: 'ai_public_access',
          successMessage: '✅ Public AI access',
        },
      ];

      toggleTests.forEach(({ type, settingKey, successMessage }) => {
        it(`should enable ${type}`, async () => {
          const result = await commandService.handleToggleCommand(type, ['on']);
          expect(mockSettingsService.upsertSettings).toHaveBeenCalledWith(settingKey, true, '');
          expect(result).toBe(`${successMessage} enabled`);
        });

        it(`should disable ${type}`, async () => {
          const result = await commandService.handleToggleCommand(type, ['off']);
          expect(mockSettingsService.upsertSettings).toHaveBeenCalledWith(settingKey, false, '');
          expect(result).toBe(`${successMessage} disabled`);
        });
      });

      it('should handle invalid toggle value', async () => {
        const result = await commandService.handleToggleCommand('auto', ['invalid']);
        expect(result).toBe("❌ Invalid argument. Use 'on' or 'off'");
      });
    });

    describe('Number Management Commands', () => {
      it('should add allowed numbers', async () => {
        const numbers = ['123456789', '987654321'];
        const result = await commandService.handleAllowCommand(numbers);

        expect(mockSettingsService.addAllowedNumbers).toHaveBeenCalledWith(numbers);
        expect(result).toContain('✅ Added 2 number(s)');
        numbers.forEach((num) => {
          expect(result).toContain(num);
        });
      });

      it('should remove specific numbers', async () => {
        const numbers = ['123456789'];
        mockWhatsAppUtils.phone.cleanMultiple.mockReturnValue(numbers);
        mockWhatsAppUtils.phone.format.mockImplementation((num) => num);

        const result = await commandService.handleRemoveCommand(numbers);

        expect(mockSettingsService.removeAllowedNumbers).toHaveBeenCalledWith(numbers);
        expect(result).toContain('✅ Removed 1 number(s)');
        expect(result).toContain(numbers[0]);
      });

      it('should remove all numbers', async () => {
        const result = await commandService.handleRemoveCommand(['all']);
        expect(mockSettingsService.removeAllNumbers).toHaveBeenCalled();
        expect(result).toBe('✅ Removed all numbers from allowed list');
      });

      it('should list allowed numbers', async () => {
        const numbers = ['123456789'];
        mockSettingsService.getAllowedNumbers.mockResolvedValue(numbers);
        mockWhatsAppUtils.templates.allowedNumbers.mockReturnValue('Formatted list');

        const result = await commandService.handleAllowedCommand();

        expect(mockSettingsService.getAllowedNumbers).toHaveBeenCalled();
        expect(mockWhatsAppUtils.templates.allowedNumbers).toHaveBeenCalled();
        expect(result).toBe('Formatted list');
      });
    });

    describe('Status Command', () => {
      it('should return current settings status', async () => {
        const settings = { auto_reply: true, ai_public_access: false };
        const allowedNumbers = ['123456789', '987654321'];

        mockSettingsService.getAllSettings.mockResolvedValue(settings);
        mockSettingsService.getAllowedNumbers.mockResolvedValue(allowedNumbers);
        mockWhatsAppUtils.templates.settingsStatus.mockReturnValue('Status summary');

        const result = await commandService.handleStatusCommand();

        expect(mockSettingsService.getAllSettings).toHaveBeenCalled();
        expect(mockSettingsService.getAllowedNumbers).toHaveBeenCalled();
        expect(mockWhatsAppUtils.templates.settingsStatus).toHaveBeenCalledWith(settings, 2);
        expect(result).toBe('Status summary');
      });
    });
  });

  describe('Command Execution', () => {
    it('should execute valid commands', async () => {
      mockTemplateService.getTemplate.mockResolvedValue('Help info');
      const result = await commandService.executeCommand({ body: '!help' });
      expect(result).toBe('Help info');
    });

    it('should handle invalid commands', async () => {
      const result = await commandService.executeCommand({ body: '!invalid' });
      expect(result).toBe('❌ Invalid command. Use !help for available commands.');
    });

    it('should handle empty commands', async () => {
      const result = await commandService.executeCommand({ body: '!' });
      expect(result).toBe(null);
    });

    it('should execute admin commands when isAdmin is true', async () => {
      mockSettingsService.upsertSettings.mockResolvedValue(undefined);
      const result = await commandService.executeCommand({ body: '!auto on' }, true);
      expect(result).toBe('✅ Auto reply enabled');
    });
  });
});
