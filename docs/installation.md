# Installation Guide

### System Requirements

- Node.js v18 or higher
- Chromium browser (installed via PPA for optimal performance)
- PM2 process manager
- Ubuntu-based operating system

### 1. Initial Setup

First, create the project directory and clone the repository:

```bash
# Create and configure project directory
sudo mkdir -p /opt/whatsapp-command-buddy
sudo chown -R $USER:$USER /opt/whatsapp-command-buddy

# Clone the repository
git clone https://github.com/tksari/whatsapp-command-buddy.git /opt/whatsapp-command-buddy
cd /opt/whatsapp-command-buddy
```

### 2. Choose Installation Method

#### Option A: Automated Installation

Use our installation script for a streamlined setup:

```bash
chmod -R +x ./scripts
./scripts/manager.sh
```

#### Option B: Manual Installation

1. Install Development Tools:

```bash
sudo apt-get install -y build-essential gcc g++ make
```

2. Install Node.js 20.x:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs
```

3. Install Chromium Browser:

```bash
sudo apt-get update
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:savoury1/chromium
sudo apt-get update
sudo apt-get install -y chromium-browser
```

4. Configure Project:

```bash
cp .env.example .env
chmod 600 .env
```

5. Install Dependencies and Configure PM2:

```bash
# Install project dependencies
npm install

# Start and configure PM2
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following configuration:

```env
#----------------------
# Notification Settings
#----------------------

# Telegram Configuration
TELEGRAM_API=""           # Telegram API endpoint
TELEGRAM_TOKEN=""         # Bot token from @BotFather
TELEGRAM_CHAT_ID=""      # Chat ID for receiving notifications

# Discord Configuration
DISCORD_WEBHOOK_URL=""    # Webhook URL for Discord notifications

# Logging Preferences
LOG_CHANNEL=""           # Options: "telegram" or "discord"

#----------------------
# AI Service Settings
#----------------------

# AI Provider Selection
AI_PROVIDER=""           # Options: "openai" or "claude"

# OpenAI Configuration
OPENAI_API_KEY=""        # Your OpenAI API key
OPENAI_MODEL=""          # Model options: "gpt-4" or "gpt-3.5-turbo"

# Claude Configuration
CLAUDE_API_KEY=""        # Your Claude API key
CLAUDE_MODEL=""          # Example: "claude-3-opus-20240229"
```
