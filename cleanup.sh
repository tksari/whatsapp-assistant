#!/bin/bash

echo "🧹 Starting Chrome/Chromium cleanup process..."

# Stop WhatsApp Bot
echo "➡️ Stopping WhatsApp Bot service..."
pm2 stop whatsapp-bot

# Kill Chrome processes
echo "➡️ Terminating Chrome/Chromium processes..."
pkill -f chrome
pkill -f chromium

# Force kill if any process remains
echo "➡️ Force terminating any remaining processes..."
pkill -9 -f chrome
pkill -9 -f chromium

# Clean lock files
echo "➡️ Cleaning lock files..."
find /opt/whatsapp-bot -name "*.lock" -delete

# Clear system cache
echo "➡️ Clearing system cache..."
sync
echo 3 > /proc/sys/vm/drop_caches

# Optional: Restart bot
#echo "➡️ Restarting WhatsApp Bot..."
#pm2 start whatsapp-bot

echo "✅ Cleanup completed successfully!"
echo "ℹ️ Note: Bot needs to be started manually with 'pm2 start whatsapp-bot'"