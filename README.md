# WhatsApp Auto-Reply Bot

![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

## 🎯 Overview
This bot was initially created for fun to handle auto-responses on WhatsApp. It's a simple yet effective solution that forwards WhatsApp messages and handles automated responses, with the ability to monitor these messages through Telegram or Discord. While originally designed as a "busy message" or "away message" bot, it can be adapted for various purposes.

⚠️ **Disclaimer**: This is an experimental project, created for educational and entertainment purposes. Use it responsibly and at your own risk.

## 🚀 Features
- **Smart Auto-Reply**: Automatically responds to incoming WhatsApp messages
- 📡 **Log Integration**: Forwards all messages, system events and logs directly to Telegram/Discord channels, providing complete monitoring capabilities with real-time message synchronization- **Contact Info**: Displays sender's name, number, and business status
- **Customizable**: Easy to modify for different use cases
- **Headless Mode**: Runs silently in the background

## 💡 Potential Use Cases
- **Auto-Response Bot**: For when you're away or busy
- **Message Forwarder**: Forward WhatsApp messages to Telegram
- **Business Hour Notifier**: Inform contacts about your working hours
- **Platform Transition**: Notify contacts about moving to a different platform
- **AI Integration**: Could be extended with AI for smarter responses *(not implemented)*
- **Data Collection**: Can be modified to collect message statistics *(optional)*

## 🛠 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/whatsapp-auto-reply-bot.git
cd whatsapp-auto-reply-bot

# Run installer
chmod +x whatsapp-bot-installer.sh
sudo ./whatsapp-bot-installer.sh