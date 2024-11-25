import pkg from 'whatsapp-web.js';

const {Client, LocalAuth} = pkg;

export class WhatsAppBot {
    constructor(config, notifier) {
        this.config = config;
        this.notifier = notifier;
        this.client = null;
    }

    async initialize() {
        try {
            this.client = new Client({
                authStrategy: new LocalAuth({
                    dataPath: this.config.whatsapp.sessionPath,
                }),
                puppeteer: {
                    headless: true,
                    executablePath: this.config.whatsapp.chromiumPath,
                    args: [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                    ],
                },
            });

            this.setupEventHandlers();
            await this.client.initialize();

            console.log("Bot initialization started...");
            await this.notifier.sendMessage("🚀 WhatsApp Bot is starting...");
        } catch (error) {
            console.error("Initialization error:", error);
            await this.notifier.sendMessage(
                `⚠️ Bot initialization error:\n${error.message}`
            );
            throw error;
        }
    }

    setupEventHandlers() {
        this.client.on("qr", async (qr) => {
            console.log("QR Code generated");
            await this.notifier.sendImage(
                "🔄 WhatsApp Bot: New QR Code generated!\n",
                qr
            );
        });

        this.client.on("ready", async () => {
            console.log("Bot is active and running!");
            await this.notifier.sendMessage("✅ WhatsApp Bot: Active and running!");
        });

        this.client.on("disconnected", async (reason) => {
            console.log("Connection lost:", reason);
            await this.notifier.sendMessage(
                `❌ WhatsApp Bot: Connection lost!\nReason: ${reason}`
            );
        });

        this.client.on("message", async (message) => {
            if (message.fromMe) return;

            await this.handleIncomingMessage(message);
        });
    }

    async handleIncomingMessage(message) {
        try {
            const messageInfo = this.formatMessageInfo(message);
            await this.notifier.sendMessage(messageInfo);

            await this.sendAutoReply(message);
        } catch (error) {
            console.error("Error handling message:", error);
            await this.notifier.sendMessage(
                `❌ Error handling message:\n${error.message}`
            );
        }
    }

    formatMessageInfo(message) {
        try {
            const contact = message._data.notifyName || 'No Name';
            const isBusiness = message._data?.isBusiness ? '(Business)' : '';

            return `
📱 New WhatsApp Message:
👤 From: ${contact} ${isBusiness}
📞 Number: ${message.from}
💬 Message: ${message.body}
⏰ Date: ${new Date().toLocaleString('tr-TR')}
        `.trim();
        } catch (error) {
            return `
📱 New WhatsApp Message:
👤 From: ${message.from}
💬 Message: ${message.body}
⏰ Date: ${new Date().toLocaleString('tr-TR')}
        `.trim();
        }
    }

    async sendAutoReply(message) {
        try {
            await this.client.sendMessage(
                message.from,
                this.config.autoReply.message
            );
            console.log("Reply sent:", message.from);
            await this.notifier.sendMessage(`✅ Reply sent to: ${message.from}`);
        } catch (error) {
            console.error("Error sending message:", error);
            await this.notifier.sendMessage(
                `❌ Error sending message:\n${error.message}`
            );
            throw error;
        }
    }
}
