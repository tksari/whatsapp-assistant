import dotenv from 'dotenv';
import { getChromeBrowserPaths, getChromeSessionPath } from './utils/helper.js';

dotenv.config();

const chromeSessionPath = getChromeSessionPath();
const chromePath = getChromeBrowserPaths();

const config = {
  logChannel: process.env.LOG_CHANNEL || null,
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    },
    claude: {
      apiKey: process.env.CLAUDE_API_KEY,
      model: process.env.CLAUDE_MODEL || 'claude-3-sonnet',
    },
  },
  telegram: {
    api: process.env.TELEGRAM_API || 'https://api.telegram.org/bot',
    token: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },
  discord: {
    webhookUrl: process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/',
  },
  chrome: {
    userDataDir: chromeSessionPath,
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--disable-web-security',
        '--disable-background-timer-throttling',
      ],
    },
  },
};

export default config;
