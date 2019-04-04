const FINANCE_URL_PREFIX = 'http://127.0.0.1:17777'
const REPORT_URL_PREFIX = 'http://127.0.0.1:7777'
const ECHARTS_CHINA_JSON_URL_PREFIX = 'https://unpkg.com/echarts@3.6.2/map/json/china.json'
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

            '/echarts@3.6.2/map/json/china.json': {
                target: ECHARTS_CHINA_JSON_URL_PREFIX,
                changOrigin: true,
                pathRewrite: {'^/echarts@3.6.2/map/json/china.json' : ''}
            }
        }
    }
}