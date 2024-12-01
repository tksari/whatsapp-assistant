export class ClaudeService {
  constructor({ aiProvider, config, logger }) {
    this.client = aiProvider;
    this.config = config;
    this.logger = logger;
  }

  async generateResponse(prompt, options = {}) {
    const response = await this.client.messages.create({
      model: this.config.model,
      system: options.systemPrompt,
      max_tokens: options.max_tokens ?? 1000,
      temperature: options.temperature ?? 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content;
  }
}
