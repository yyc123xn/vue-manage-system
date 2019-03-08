
module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/finance/developer/login': {
                target: 'http://127.0.0.1:17777/finance/developer/login',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/developer/login': ''
                }
            },
            '/finance/common/menu': {
                target: 'http://127.0.0.1:17777/finance/common/menu',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/common/menu': ''
                }
            },
            '/finance/voucher/voucher_type': {
                target: 'http://127.0.0.1:17777/finance/voucher/voucher_type',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/voucher/voucher_type': ''
                }
            },
            '/finance/voucher/voucher_filter_fields': {
                target: 'http://127.0.0.1:17777/finance/voucher/voucher_filter_fields',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/voucher/voucher_filter_fields': ''
                }
            },

            '/report/report/chart_types': {
                target: 'http://127.0.0.1:7777/report/report/chart_types',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/report/chart_types': ''
                }
            }
        }
    }
}