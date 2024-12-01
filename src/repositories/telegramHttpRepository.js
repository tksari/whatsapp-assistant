export class TelegramHttpRepository {
  constructor({ httpClientService, config }) {
    const { api, token } = config.telegram;
    this.http = httpClientService;
    this.baseUrl = `${api}${token}`;
  }

  async sendTextMessage(chatId, payload) {
    return await this.http.post(`${this.baseUrl}/sendMessage`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        ...payload,
      }),
    });
  }

  async sendPhoto(chatId, formData) {
    return await this.http.postFormData(`${this.baseUrl}/sendPhoto`, formData);
  }
}
