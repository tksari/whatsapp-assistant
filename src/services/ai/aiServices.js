import {
  SUPPORTED_LANGUAGES,
  SYSTEM_PROMPTS,
  TASK_MESSAGES,
  DEFAULT_LANGUAGE,
  MODEL_PARAMETERS,
} from '../../core/config/ai/index.js';

export class AIService {
  constructor({ logger, messageNotificationService, aiProvider }) {
    this.ai = aiProvider;
    this.logger = logger;
    this.messageNotification = messageNotificationService;
  }

  getValidLanguage(language) {
    if (!language || !Object.values(SUPPORTED_LANGUAGES).includes(language)) {
      this.logger.warn(`Unsupported language: ${language}, using default: ${DEFAULT_LANGUAGE}`);
      return DEFAULT_LANGUAGE;
    }
    return language;
  }

  getDefaultOptions(language) {
    const validLanguage = this.getValidLanguage(language);
    return {
      language: validLanguage,
      systemPrompt: SYSTEM_PROMPTS[validLanguage],
      ...MODEL_PARAMETERS.defaults,
    };
  }

  async processMessage(message, language) {
    try {
      const validLanguage = this.getValidLanguage(language);

      const AIReply = await this.generateResponse(message.body, {
        language: validLanguage,
      });

      await Promise.all([
        this.logger.info('AI reply sent:', {
          recipient: message.from,
          messageId: message.id,
          language: validLanguage,
        }),
        this.messageNotification.notifyNewMessage(`✅ AI reply sent to: ${message.from}`),
      ]);

      return AIReply;
    } catch (error) {
      this.logger.error('Error processing message:', error);
      throw error;
    }
  }

  async generateResponse(message, options = {}) {
    const finalOptions = {
      ...this.getDefaultOptions(options.language),
      ...options,
    };

    try {
      return await this.ai.generateResponse(message, finalOptions);
    } catch (error) {
      this.logger.error('Error generating response:', {
        error,
        body: message.body,
        options: finalOptions,
      });
      throw error;
    }
  }

  async generateWithTemplate(message, taskType, language, customOptions = {}) {
    const validLanguage = this.getValidLanguage(language);

    const options = {
      ...this.getDefaultOptions(validLanguage),
      ...MODEL_PARAMETERS.tasks[taskType],
      ...customOptions,
      systemPrompt: `${SYSTEM_PROMPTS[validLanguage]}\nTask: ${TASK_MESSAGES[taskType][validLanguage]}`,
    };

    try {
      return await this.generateResponse(message, options);
    } catch (error) {
      this.logger.error('Error generating template response:', {
        error,
        taskType,
        language: validLanguage,
      });
      throw error;
    }
  }

  async generateSummary(message, language) {
    return this.generateWithTemplate(message, 'summary', language);
  }

  async generateAnalysis(message, language) {
    return this.generateWithTemplate(message, 'analysis', language);
  }

  async generateIdeas(message, language) {
    return this.generateWithTemplate(message, 'ideas', language);
  }
}
