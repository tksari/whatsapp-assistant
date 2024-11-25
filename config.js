import dotenv from "dotenv";

dotenv.config();

const config = {
    logChannel: process.env.LOG_CHANNEL || null,
    telegram: {
        api: process.env.TELEGRAM_API || 'https://api.telegram.org/bot',
        token: process.env.TELEGRAM_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
    },
    discord: {
        webhookUrl: process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/'
    },
    whatsapp: {
        sessionPath: "/opt/whatsapp-bot/sessions",
        chromiumPath: "/usr/bin/chromium-browser",
    },
    autoReply: {
        message: process.env.AUTO_REPLY_MESSAGE
    }
};
export default config;

