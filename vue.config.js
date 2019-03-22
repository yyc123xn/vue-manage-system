const FINANCE_URL_PREFIX = 'http://127.0.0.1:17777'
const REPORT_URL_PREFIX = 'http://127.0.0.1:7777'
module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/finance' : {
                    target: FINANCE_URL_PREFIX,
                    changeOrigin: true
                },

            '/report' : {
                target: REPORT_URL_PREFIX,
                changeOrigin: true
            },
        }
    }
}