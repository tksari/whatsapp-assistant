export class WhatsAppManager {
  constructor({ whatsAppClient, messageHandlerService, notification, logger }) {
    this.client = whatsAppClient;
    this.messageHandler = messageHandlerService;
    this.notification = notification;
    this.logger = logger;
  }

  async initialize() {
    this.#setupEventHandlers();

    await this.client.initialize();

    this.logger.info('App started successfully');
    this.notification.sendMessage('App started successfully');
  }

  async destroy() {
    await this.client.destroy();
    this.logger.info('App Stopped');
    this.notification.sendMessage('App Stopped');
  }

  #setupEventHandlers() {
    this.client
      .on('qr', async (qr) => {
        this.logger.info('QR Code generated');
        this.notification.sendImage('New QR Code generated', qr);
      })
      .on('ready', async () => {
        this.logger.info('App is ready');
        this.notification.sendMessage('App is ready');
      })
      .on('disconnected', async (reason) => {
        this.logger.warn('App disconnected', { reason });
        this.notification.sendMessage('App disconnected: ' + reason);
      })
      .on('message_create', async (message) => {
        if (message.from === message.to) {
          this.messageHandler.handleCommand(message, true);
        }
      })
      .on('message', async (message) => {
        this.messageHandler.handleMessage(message);
      });
  }

  getStatus() {
    return {
      isConnected: Boolean(this.client),
      isReady: Boolean(this.client?.isReady),
    };
  }
}
