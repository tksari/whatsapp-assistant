export class DiscordService {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    async sendMessage(message) {
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: message,
                    username: 'WhatsApp Bot'
                })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Discord API Error: ${error}`);
            }
            console.log('Discord message sent successfully');
        } catch (error) {
            console.error('Error sending Discord message:', error);
            throw error;
        }
    }

    async sendImage(image, caption) {
        try {
            const formData = new FormData();

            const payload = {
                username: 'WhatsApp Bot',
                content: caption || ''
            };
            formData.append('payload_json', JSON.stringify(payload));
            formData.append('file', image, 'image.png');

            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Discord API Error: ${error}`);
            }
            console.log('Discord image sent successfully');
        } catch (error) {
            console.error('Error sending Discord image:', error);
            throw error;
        }
    }
}