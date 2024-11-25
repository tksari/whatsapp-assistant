import fetch from "node-fetch";
import FormData from "form-data";
import QRCode from "qrcode";

export class TelegramService {
    constructor(apiUrl, token, chatId) {
        this.chatId = chatId;
        this.preparedApiUrl = `${apiUrl}${token}`;
    }

    async sendMessage(message) {
        try {
            const response = await fetch(`${this.preparedApiUrl}/sendMessage`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: "HTML",
                }),
            });

            const data = await response.json();
            if (!data.ok) {
                throw new Error(`Telegram API Error: ${data.description}`);
            }
            console.log("Telegram notification sent successfully");
        } catch (error) {
            console.error("Error sending Telegram message:", error);
            throw error;
        }
    }

    async sendImage(message, qrData) {
        try {
            const qrCodeBuffer = await QRCode.toBuffer(qrData);
            const formData = new FormData();
            formData.append("chat_id", this.chatId);
            formData.append("photo", qrCodeBuffer, "qrcode.png");
            formData.append("caption", message);

            const response = await fetch(`${this.preparedApiUrl}/sendPhoto`, {
                method: "POST",
                body: formData,
                headers: {...formData.getHeaders()},
            });

            const data = await response.json();
            if (!data.ok) {
                throw new Error(`Telegram API Error: ${data.description}`);
            }
            console.log("QR Code sent to Telegram successfully");
        } catch (error) {
            console.error("Error sending QR Code to Telegram:", error);
            await this.sendMessage(`Error sending QR Code: ${error.message}`);
            throw error;
        }
    }
}
