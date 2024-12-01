export class OpenAiService {
  constructor({ aiProvider, config, logger }) {
    this.client = aiProvider;
    this.config = config;
    this.logger = logger;
  }

  async generateResponse(prompt, options = {}) {
    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages: [
        { role: 'system', content: options.systemPrompt ?? '' },
        { role: 'user', content: prompt },
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1000,
    });

    return response.choices[0].message.content;
  }
}
