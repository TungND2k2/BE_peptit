module.exports = {
    apps: [
        {
            name: 'ppt-api',
            script: 'dist/index.js',
            args: ' ',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                PORT: 3005,
            },
        },

    ],
};
