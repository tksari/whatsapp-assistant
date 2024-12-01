#!/usr/bin/env bash

GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

APP_NAME=$(grep '"name"' "${PROJECT_ROOT}/package.json" | awk -F': ' '{print $2}' | tr -d '",')
DISPLAY_NAME=$(grep '"display-name"' "${PROJECT_ROOT}/package.json" | awk -F': ' '{print $2}' | tr -d '",')

log_info() {
    echo -e "➡️ ${CYAN}$1${NC}"
}

log_success() {
    echo -e "✅ ${GREEN}$1${NC}"
}

log_warning() {
   echo -e "⚠️ ${YELLOW}$1${NC}"
}

log_error() {
    echo -e "❌ ${RED}$1${NC}"
}