import FormData from 'form-data';
import QRCode from 'qrcode';

export class TelegramService {
  constructor({ telegramHttpRepository, config, logger }) {
    this.repository = telegramHttpRepository;
    this.logger = logger;
    this.chatId = config.telegram.chatId;
  }

  async sendMessage(message) {
    const payload = {
      text: message,
      parse_mode: 'HTML',
    };

    const result = await this.repository.sendTextMessage(this.chatId, payload);
    if (result) {
      this.logger.info('Telegram notification sent successfully');
    }
  }

  async sendImage(message, qrData) {
    const qrCodeBuffer = await QRCode.toBuffer(qrData);
    const formData = new FormData();
    formData.append('chat_id', this.chatId);
    formData.append('photo', qrCodeBuffer, 'qrcode.png');
    formData.append('caption', message);

    const result = await this.repository.sendPhoto(this.chatId, formData);
    if (result) {
      this.logger.info('QR Code sent to Telegram successfully');
    }
  }
}
