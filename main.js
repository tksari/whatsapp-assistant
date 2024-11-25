import {WhatsAppBot} from "./whatsappBot.js";
import config from "./config.js";
import {NotificationManager} from "./notificationManager.js";

async function main() {
    try {
        const notifier = new NotificationManager(config);
        const whatsappBot = new WhatsAppBot(config, notifier);
        await whatsappBot.initialize();
    } catch (error) {
        console.error("Fatal error:", error);
        process.exit(1);
    }
}

main();
