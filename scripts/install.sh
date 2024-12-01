#!/usr/bin/env bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

source "${PROJECT_ROOT}/scripts/helpers.sh"

if [ ! -d "${PROJECT_ROOT}/src/storage/" ]; then
   log_error "Directory ${PROJECT_ROOT}/src/storage/ not found!"
   log_info "Creating directory structure..."
    mkdir -p "${PROJECT_ROOT}/src/storage/"
fi

echo "🚀 Starting ${DISPLAY_NAME} Installation..."

if ! command -v python3 &> /dev/null; then
    log_info "Installing Python3..."
    sudo apt-get install -y python3
fi

log_info "Installing build essentials..."
sudo apt-get install -y build-essential make gcc g++

if ! command -v node &> /dev/null; then
   log_info "Installing Node.js 20.x..."
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash - || {
       log_error "Failed to setup Node.js repository"
       exit 1
   }
   sudo apt-get install -y nodejs || {
       log_error "Failed to install Node.js"
       exit 1
   }
elif [[ $(env PATH=$PATH node -v | cut -d 'v' -f 2 | cut -d '.' -f 1) -lt 18 ]]; then
   log_warning "Node.js version is below 18. Upgrading to 20.x..."
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
   sudo apt-get install -y nodejs
else
   log_success "Node.js v$(env PATH=$PATH node -v) is already installed and compatible"
fi

if [[ "$(uname)" == "Linux" ]]; then
   log_info "Do you want to install Chromium? (y/n)"
   read -r answer

   if [[ "$answer" =~ ^[Yy]$ ]]; then

       log_info "Updating system packages..."
       sudo apt-get clean
       sudo apt-get update -y || {
           log_error "Failed to update system packages"
           exit 1
       }

       log_info "Installing required dependencies..."
       sudo apt-get install -y software-properties-common || {
           log_error "Failed to install software-properties-common"
           exit 1
       }

       log_info "Adding Chromium repository..."
       sudo add-apt-repository -y ppa:savoury1/chromium || {
           log_error "Failed to add Chromium PPA"
           exit 1
       }

       log_info "Updating package lists..."
       sudo apt-get update || {
           log_error "Failed to update package lists"
           exit 1
       }

       log_info "Installing Chromium..."
       sudo apt-get install -y chromium-browser || {
           log_error "Failed to install Chromium"
           exit 1
       }

       log_success "Chromium installation completed successfully"
   else
       log_info "Skipping Chromium installation"
   fi
else
   log_info "Skipping Chromium installation: Not a Linux system"
fi

log_info "Setting proper permissions..."
sudo chmod -R 755 "${PROJECT_ROOT}/src/storage"
sudo chown -R $USER:$USER "${PROJECT_ROOT}/src/storage"

log_info "Installing project dependencies..."
npm install || {
   log_error "Failed to install npm dependencies"
   exit 1
}

log_info "Installing PM2..."
npm install -g pm2 || {
   log_error "Failed to install PM2"
   exit 1
}

log_info "Setting up environment file..."
if [ -f "${PROJECT_ROOT}/.env.example" ]; then
   if [ ! -f "${PROJECT_ROOT}/.env" ]; then
       cp "${PROJECT_ROOT}/.env.example" "${PROJECT_ROOT}/.env"
       chmod 600 "${PROJECT_ROOT}/.env"
       log_success "Created .env file from example"
       log_warning "Please edit your .env file now before continuing..."

       read -p "📝 Press ENTER when you're done editing .env file..."

       if [ ! -f "${PROJECT_ROOT}/.env" ]; then
           log_error ".env file not found after waiting for edit!"
           exit 1
       fi
   else
       log_success "Found existing .env file"
       log_warning "Please verify your .env file settings before continuing..."
       log_info "Would you like to review/edit the .env file? (y/N)"
       read -n 1 -r

       echo
       if [[ $REPLY =~ ^[Yy]$ ]]; then
           echo "Please edit your .env file now."
           read -p "📝 Press ENTER when you're done editing .env file..."
       fi
   fi
else
   log_error "No .env.example file found! Application might not work properly."
   read -p "Press ENTER to continue anyway..."
fi

start_pm2_process() {
    log_info "Starting PM2 process for ${APP_NAME}..."
    pm2 start "${PROJECT_ROOT}/ecosystem.config.cjs" || {
        log_error "Failed to start application with PM2"
        exit 1
    }
}

delete_pm2_process() {
    log_info "Deleting existing PM2 process for ${APP_NAME}..."
    pm2 stop "${APP_NAME}" || log_warning "Failed to stop existing PM2 process"
    pm2 delete "${APP_NAME}" || log_warning "Failed to delete existing PM2 process"
}

if pm2 list | grep -q "${APP_NAME}"; then
    log_warning "An existing PM2 process with name ${APP_NAME} found."

    log_info "Do you want to delete and recreate the PM2 process? (y/n)"
    read -n 1 -r

    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        delete_pm2_process
        start_pm2_process
    else
        log_info "Skipping PM2 process deletion."
    fi
else
    log_info "No existing PM2 process found."
    start_pm2_process
fi

pm2 save --force
pm2 startup

log_success "Installation completed successfully!"
echo ""
echo "🔍 Next steps:"
echo "1. Check status with: pm2 status"
echo "2. View logs with: pm2 logs ${APP_NAME}"
echo "3. Monitor application with: pm2 monit"
echo ""
echo "For more information on PM2, check out: https://pm2.keymetrics.io/docs/usage/quick-start/"

if [ ! -f "${PROJECT_ROOT}/.env" ]; then
   log_warning "No .env file found! Please create one before using the application."
   echo "After creating .env file, run: pm2 reload all"
fi