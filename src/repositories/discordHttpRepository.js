export class DiscordHttpRepository {
  constructor({ httpClientService, config }) {
    this.http = httpClientService;
    this.webhookUrl = config.discord.webhookUrl;
  }

  async sendWebhookMessage(payload) {
    return await this.http.post(this.webhookUrl, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  async sendWebhookFile(formData) {
    return await this.http.postFormData(this.webhookUrl, formData);
  }
}
