import FormData from 'form-data';
import QRCode from 'qrcode';

export class DiscordService {
  constructor({ discordHttpRepository, logger }) {
    this.repository = discordHttpRepository;
    this.logger = logger;
  }

  async sendMessage(message) {
    const payload = {
      content: message,
      username: 'WhatsApp Bot',
    };

    const result = await this.repository.sendWebhookMessage(payload);
    if (result) {
      this.logger.info('Discord message sent successfully');
    }
  }

  async sendImage(qrData, caption) {
    const qrCodeBuffer = await QRCode.toBuffer(qrData);
    const formData = new FormData();

    const payload = {
      username: 'WhatsApp Bot',
      content: caption || '',
    };

    formData.append('payload_json', JSON.stringify(payload));
    formData.append('file', qrCodeBuffer, 'qrcode.png');

    const result = await this.repository.sendWebhookFile(formData);
    if (result) {
      this.logger.info('Discord image sent successfully');
    }
  }
}
