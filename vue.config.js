const FINANCE_URL_PREFIX = 'http://127.0.0.1:17777'
const REPORT_URL_PREFIX = 'http://127.0.0.1:7777'
module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/finance/developer/login': {
                target: FINANCE_URL_PREFIX + '/finance/developer/login',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/developer/login': ''
                }
            },
            '/finance/common/menu': {
                target: FINANCE_URL_PREFIX + '/finance/common/menu',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/common/menu': ''
                }
            },
            '/finance/voucher/voucher_type': {
                target: FINANCE_URL_PREFIX + '/finance/voucher/voucher_type',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/voucher/voucher_type': ''
                }
            },
            '/finance/voucher/voucher_filter_fields': {
                target: FINANCE_URL_PREFIX + '/finance/voucher/voucher_filter_fields',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/voucher/voucher_filter_fields': ''
                }
            },
            '/finance/fixed_assets/fixed_assets_filter_fields': {
                target: FINANCE_URL_PREFIX + '/finance/fixed_assets/fixed_assets_filter_fields',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/fixed_assets/fixed_assets_filter_fields': ''
                }
            },
            '/report/dashboard/dashboard_filter_fields': {
                target: REPORT_URL_PREFIX + '/report/dashboard/dashboard_filter_fields',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/dashboard/dashboard_filter_fields': ''
                }
            },
            '/report/data_set/data_set_filter_fields': {
                target: REPORT_URL_PREFIX + '/report/data_set/data_set_filter_fields',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_set/data_set_filter_fields': ''
                }
            },
            '/finance/developer/developer_filter_fields': {
                target: FINANCE_URL_PREFIX + '/finance/developer/developer_filter_fields',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/developer/developer_filter_fields': ''
                }
            },
            '/report/data_source/data_source_filter_fields': {
                target: REPORT_URL_PREFIX + '/report/data_source/data_source_filter_fields',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_source/data_source_filter_fields': ''
                }
            },

            '/report/report/chart_types': {
                target: REPORT_URL_PREFIX + '/report/report/chart_types',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/report/chart_types': ''
                }
            }
        }
    }
}