module.exports = {
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5001',
                changeOrigin: true
            }
        }
    },
    transpileDependencies: ['vuetify']
};
