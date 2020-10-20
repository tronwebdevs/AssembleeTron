module.exports = {
    css: {
        loaderOptions: {
            sass: {
                data: `
                @import "@/scss/_variables.scss";
                @import "@/scss/_mixed.scss";
                @import "@/scss/_toast-custom.scss";
                `
            }
        }
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5001',
                changeOrigin: true
            }
        }
    }
};
