import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { OpenAiService } from '../services/ai/openAiService.js';
import { ClaudeService } from '../services/ai/claudeService.js';

export class AIServiceFactory {
  constructor(config, logger) {
    this.config = config.ai;
    this.logger = logger;
  }

  createService() {
    const client = this.createClient();
    const ServiceClass = this.getServiceClass();

    return new ServiceClass({
      aiProvider: client,
      config: this.getServiceConfig(),
      logger: this.logger,
    });
  }

  createClient() {
    const clients = {
      openai: () => new OpenAI({ apiKey: this.config.openai.apiKey }),
      claude: () => new Anthropic({ apiKey: this.config.claude.apiKey }),
    };

    const clientCreator = clients[this.config.provider];

    if (!clientCreator) {
      throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }

    return clientCreator();
  }

  getServiceClass() {
    const services = {
      openai: OpenAiService,
      claude: ClaudeService,
    };

    return services[this.config.provider];
  }

  getServiceConfig() {
    return this.config[this.config.provider];
  }
}
