import { BOT_COMMANDS } from '../../constants/commandConstants.js';

export class CommandService {
  constructor({ settingsService, aiService, whatsAppUtils, templateService }) {
    this.settingsService = settingsService;
    this.aiService = aiService;
    this.utils = whatsAppUtils;
    this.templateService = templateService;
    this.botCommands = BOT_COMMANDS;
  }

  #getCommandText(message) {
    try {
      if (!message?.body) return '';

      let text = String(message.body).trim();

      if (message.mentionedIds?.length > 0) {
        text = text.replace(/@\d+\s*/, '').trim();
      }

      return text;
    } catch (error) {
      this.logger.error('Command text extraction error:', error);
      return '';
    }
  }

  isValidCommand(message) {
    const text = this.#getCommandText(message);
    return Boolean(text && text.startsWith('!'));
  }

  parseMessage(message) {
    const text = this.#getCommandText(message);

    const parts = text.split(' ').filter((part) => part.length > 0);
    const command = parts[0].slice(1).toLowerCase();
    const args = parts.slice(1);

    return { command, args };
  }

  async executeCommand(data, isAdmin = false) {
    const { command, args } = this.parseMessage(data);

    if (!command) {
      return null;
    }

    const { AI, SUM, ANALYZE, IDEA, HELP, AUTO, AI_PUBLIC, ALLOW, REMOVE, ALLOWED, STATUS } = this.botCommands;

    const AI_COMMANDS = {
      [AI]: AI,
      [SUM]: SUM,
      [ANALYZE]: ANALYZE,
      [IDEA]: IDEA,
    };

    const publicCommandHandlers = {
      ...Object.entries(AI_COMMANDS).reduce(
        (acc, [cmd, type]) => ({
          ...acc,
          [cmd]: () => this.handleAICommand(type, args),
        }),
        {}
      ),
      [HELP]: () => this.handleHelpCommand(false),
    };

    const adminCommandHandlers = {
      ...publicCommandHandlers,
      [AUTO]: () => this.handleToggleCommand('auto', args),
      [AI_PUBLIC]: () => this.handleToggleCommand('ai_public', args),
      [ALLOW]: () => this.handleAllowCommand(args),
      [REMOVE]: () => this.handleRemoveCommand(args),
      [ALLOWED]: () => this.handleAllowedCommand(),
      [STATUS]: () => this.handleStatusCommand(),
      [HELP]: () => this.handleHelpCommand(true),
    };

    const handlers = isAdmin ? adminCommandHandlers : publicCommandHandlers;
    const handler = handlers[command];

    if (!handler) {
      return '❌ Invalid command. Use !help for available commands.';
    }

    return await handler();
  }

  async handleHelpCommand(isAdmin) {
    const aiCommands = this.templateService.getTemplate('helpAiCommand');
    let helpMessage = aiCommands;

    if (isAdmin) {
      const adminCommands = this.templateService.getTemplate('helpAdminCommand');
      helpMessage += '\n' + adminCommands;
    }

    return helpMessage;
  }

  async handleToggleCommand(commandType, args) {
    const [toggle, ...messageWords] = args;
    if (!toggle || !['on', 'off'].includes(toggle.toLowerCase())) {
      return "❌ Invalid argument. Use 'on' or 'off'";
    }

    const settingKey = commandType === 'auto' ? 'auto_reply' : 'ai_public_access';
    const enabled = toggle.toLowerCase() === 'on';
    const message = messageWords.join(' ');

    await this.settingsService.upsertSettings(settingKey, enabled, message);
    return `✅ ${commandType === 'auto' ? 'Auto reply' : 'Public AI access'} ${enabled ? 'enabled' : 'disabled'}`;
  }

  async handleAllowCommand(numbers) {
    if (!numbers.length) {
      return '❌ Please provide phone number(s)';
    }
    await this.settingsService.addAllowedNumbers(numbers);
    return `✅ Added ${numbers.length} number(s) to allowed list:\n${numbers.join('\n')}`;
  }

  async handleRemoveCommand(args) {
    if (!args.length) {
      return "❌ Please provide phone number(s) or use 'all' to remove all numbers";
    }

    if (args[0].toLowerCase() === 'all') {
      await this.settingsService.removeAllNumbers();
      return '✅ Removed all numbers from allowed list';
    }

    const cleanNumbers = this.utils.phone.cleanMultiple(args);
    await this.settingsService.removeAllowedNumbers(cleanNumbers);
    return `✅ Removed ${args.length} number(s) from allowed list:\n${cleanNumbers
      .map((num) => this.utils.phone.format(num))
      .join('\n')}`;
  }

  async handleAllowedCommand() {
    const numbers = await this.settingsService.getAllowedNumbers();
    return this.utils.templates.allowedNumbers(numbers, (num) => num);
  }

  async handleStatusCommand() {
    const settings = await this.settingsService.getAllSettings();
    const allowedNums = await this.settingsService.getAllowedNumbers();
    return this.utils.templates.settingsStatus(settings, allowedNums.length);
  }

  async handleAICommand(command, args) {
    if (!args.length) {
      return '❌ Please provide text for the AI command';
    }

    const text = args.join(' ');

    const commandMap = {
      [this.botCommands.AI]: 'generateResponse',
      [this.botCommands.SUM]: 'generateSummary',
      [this.botCommands.ANALYZE]: 'generateAnalysis',
      [this.botCommands.IDEA]: 'generateIdeas',
    };

    const method = commandMap[command];

    return await this.aiService[method](text, 'en');
  }
}
