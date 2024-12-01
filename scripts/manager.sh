#!/usr/bin/env bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${SCRIPT_DIR}/helpers.sh"

show_usage() {
    echo "Usage: $0 [-i|--install|-r|--restart|-h|--help]"
    echo "Options:"
    echo "  -i, --install    Install ${DISPLAY_NAME}"
    echo "  -r, --restart    Restart ${DISPLAY_NAME}"
    echo "  -h, --help       Show this help message"
    exit 1
}

echo ${SCRIPT_DIR}

case "${1:-}" in
    -i|--install)
        "${SCRIPT_DIR}/install.sh"
        ;;
    -r|--restart)
        "${SCRIPT_DIR}/restart.sh"
        ;;
    -h|--help)
        show_usage
        ;;
    *)
        log_info "Choose an action to perform:"
        echo "1) Install ${DISPLAY_NAME}"
        echo "2) Restart ${DISPLAY_NAME}"
        # shellcheck disable=SC2162
        read -p "Enter your choice (1 or 2): " choice
        case $choice in
            1)
                 "${SCRIPT_DIR}/install.sh"
                ;;
            2)
                 "${SCRIPT_DIR}/restart.sh"
                ;;
            *)
                log_error "Invalid choice"
                show_usage
                ;;
        esac
        ;;
esac