#!/usr/bin/env bash

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

source "${PROJECT_ROOT}/scripts/helpers.sh"

echo "🧹 Starting Chrome/Chromium cleanup process..."

process_exists() {
    pgrep -f "$1" >/dev/null
    return $?
}

log_info "Stopping ${DISPLAY_NAME} service..."
if pm2 list | grep -q "${APP_NAME}"; then
    pm2 stop ${APP_NAME}
else
    log_info "${DISPLAY_NAME} service not found in PM2"
fi

log_info "Terminating Chromium processes..."
if process_exists "chrome" || process_exists "chromium"; then
    pkill -f chrome || true
    pkill -f chromium || true

    sleep 2

    if process_exists "chrome" || process_exists "chromium"; then
        log_info "Force terminating remaining processes..."
        pkill -9 -f chrome || true
        pkill -9 -f chromium || true
    fi
else
    log_info "No Chromium processes found"
fi

log_info "Cleaning Chrome lock files..."
if [ -d "${PROJECT_ROOT}/src/storage/sessions" ]; then
    find "${PROJECT_ROOT}/src/storage/sessions" -name "*.lock" -delete
    log_success "Lock files cleaned"
else
    log_info "Storage directory not found"
fi


log_info "Restarting ${DISPLAY_NAME}..."
pm2 start ${APP_NAME}
log_success "${DISPLAY_NAME} restarted successfully!"

log_success "Cleanup completed successfully!"