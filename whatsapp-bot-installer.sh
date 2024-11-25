#!/bin/bash

echo "🚀 Starting WhatsApp Bot Installation..."

if ! command -v node &> /dev/null || [[ $(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1) -lt 18 ]]; then
   echo "➡️ Installing Node.js 20.x..."
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
else
   echo "✅ Node.js v$(node -v) is already installed and compatible"
fi

echo "➡️ Updating system packages..."
sudo apt-get clean
sudo apt-get update -y

echo "➡️ Installing Chromium..."
sudo apt-get install -y chromium-browser

echo "➡️ Creating directory structure..."
sudo mkdir -p /opt/whatsapp-bot/{logs,sessions}
cd /opt/whatsapp-bot

echo "➡️ Setting proper permissions..."
sudo chown -R $USER:$USER /opt/whatsapp-bot
sudo chmod -R 755 /opt/whatsapp-bot

echo "➡️ Installing project dependencies..."
npm install

echo "➡️ Installing PM2..."
sudo npm install -g pm2

echo "➡️ Setting up environment file..."
if [ -f .env.example ]; then
  cp .env.example .env
  chmod 600 .env
  echo "✅ Created .env file from example. Please edit it with your settings!"
  echo "⚠️ Please edit your .env file now before continuing..."
  echo "📝 Press ENTER when you're done editing .env file..."
  read
else
  echo "⚠️ No .env.example file found! Application might not work properly."
  echo "Press ENTER to continue anyway..."
  read
fi

# Setup PM2
echo "➡️ Setting up PM2..."
pm2 stop whatsapp-bot 2>/dev/null || true
pm2 delete whatsapp-bot 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

echo "✨ Installation completed successfully!"
echo ""
echo "🔍 Next steps:"
echo "1. Check bot status with: pm2 status"
echo "2. View logs with: pm2 logs whatsapp-bot"
echo "3. Monitor application with: pm2 monit"
echo ""
echo "📊 Monitoring Commands:"
echo "- pm2 status      : Show process status"
echo "- pm2 logs        : Display logs"
echo "- pm2 monit       : Monitor CPU/Memory usage"
echo "- pm2 reload all  : Reload all applications"
echo ""
if [ ! -f .env ]; then
   echo "⚠️ WARNING: No .env file found! Please create one before using the application."
   echo "After creating .env file, run: pm2 reload all"
fi