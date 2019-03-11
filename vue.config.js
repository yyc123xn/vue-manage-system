const FINANCE_URL_PREFIX = 'http://127.0.0.1:17777'
const REPORT_URL_PREFIX = 'http://127.0.0.1:7777'
module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        proxy: {

            '/finance/developer' : {
                target: FINANCE_URL_PREFIX + '/finance/developer',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/developer': ''
                }
            },

            '/finance/developer/current' : {
                target: FINANCE_URL_PREFIX + '/finance/developer/current',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/developer/current': ''
                }
            },

            '/finance/developer/login': {
                target: FINANCE_URL_PREFIX + '/finance/developer/login',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/developer/login': ''
                }
            },

            '/report/developer/login': {
                target: REPORT_URL_PREFIX + '/report/developer/login',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/developer/login': ''
                }
            },

            '/finance/developer/privileges': {
                target: FINANCE_URL_PREFIX + '/finance/developer/privileges',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/developer/privileges': ''
                }
            },

            '/finance/developer/academic_degrees': {
                target: FINANCE_URL_PREFIX + '/finance/developer/academic_degrees',
                changeOrigin: true,
                pathRewrite: {
                    '^/finance/developer/academic_degrees': ''
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

            '/report/data_source/database/tables': {
                target: REPORT_URL_PREFIX + '/report/data_source/database/tables',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_source/database/tables': ''
                }
            },

            '/report/data_source': {
                target: REPORT_URL_PREFIX + '/report/data_source',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_source': ''
                }
            },

            '/report/data_source/info': {
                target: REPORT_URL_PREFIX + '/report/data_source/info',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_source/info': ''
                }
            },

            '/report/data_source/data_source_types': {
                target: REPORT_URL_PREFIX + '/report/data_source/data_source_types',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_source/data_source_types': ''
                }
            },

            '/report/data_source/databases/tables': {
                target: REPORT_URL_PREFIX + '/report/data_source/databases/tables',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_source/databases/tables': ''
                }
            },

            '/report/data_set/periods': {
                target: REPORT_URL_PREFIX + '/report/data_set/periods',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_set/periods': ''
                }
            },

            '/report/data_set/data_types': {
                target: REPORT_URL_PREFIX + '/report/data_set/data_types',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_set/data_types': ''
                }
            },

            '/report/data_set/calculate_types': {
                target: REPORT_URL_PREFIX + '/report/data_set/calculate_types',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_set/calculate_types': ''
                }
            },

            '/report/data_set/field_types': {
                target: REPORT_URL_PREFIX + '/report/data_set/field_types',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_set/field_types': ''
                }
            },

            '/report/data_set': {
                target: REPORT_URL_PREFIX + '/report/data_set',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_set': ''
                }
            },

            '/report/data_set/info': {
                target: REPORT_URL_PREFIX + '/report/data_set/info',
                changeOrigin: true,
                pathRewrite: {
                    '^/report/data_set/info': ''
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