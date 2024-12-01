import pkg from 'whatsapp-web.js';

const { Client, LocalAuth } = pkg;

export class WhatsAppClientFactory {
  static createClient(config) {
    if (!config.chrome) {
      throw new Error('Chrome configuration is required');
    }

    return new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: config.chrome.puppeteer.headless,
        executablePath: config.chrome.puppeteer.executablePath,
        args: config.chrome.puppeteer.args,
      },
    });
  }
}
