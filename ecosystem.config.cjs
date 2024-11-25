module.exports = {
    apps: [{
        name: "whatsapp-bot",
        script: "/opt/whatsapp-bot/main.js",
        watch: false,
        max_memory_restart: "500M",
        restart_delay: 5000,
        env: {
            NODE_ENV: "production",
            CHROMIUM_PATH: "/usr/bin/chromium-browser"
        },
        error_file: "/opt/whatsapp-bot/logs/err.log",
        out_file: "/opt/whatsapp-bot/logs/out.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss",
        time: true,
        exp_backoff_restart_delay: 100,
        kill_timeout: 10000
    }]
};