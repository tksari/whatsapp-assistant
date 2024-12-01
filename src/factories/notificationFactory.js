export const NotificationFactory = ({ config, telegramService, discordService, logger }) => {
  // TODO: Improve error handling and default service implementation
  const createService = (driver = config.logChannel) => {
    switch (driver) {
      case 'telegram':
        return telegramService;
      case 'discord':
        return discordService;
      default:
        logger.warn(`Unsupported notification driver: ${driver}`);
        return {
          async sendMessage() {
            return null;
          },
          async sendImage() {
            return null;
          },
        };
    }
  };

  return {
    createService,
  };
};
