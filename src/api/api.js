import axios from 'axios'

const api = {


    LOGIN : '/finance/developer/login',

    login (username, password) {
        let url = this.LOGIN + '?username=' + username + '&password=' + password
        return axios.get(url)
    },

    GET_MENU : '/finance/common/menu',

    getMenu () {
        let url = this.GET_MENU
        return axios.get(url)
    },

    GET_VOUCHER_TYPES : '/finance/voucher/voucher_type',

    getVoucherTypes() {
        let url = this.GET_VOUCHER_TYPES
        return axios.get(url)
    },

    GET_VOUCHER_FILTER_FIELDS : '/finance/voucher/voucher_filter_fields',

    getVoucherFilterFields() {
        let url = this.GET_VOUCHER_FILTER_FIELDS
        return axios.get(url)
    },

    GET_FIXED_ASSETS_FILTER_FIELDS : '/finance/fixed_assets/fixed_assets_filter_fields',

    getFixedAssetsFilterFields() {
        let url = this.GET_FIXED_ASSETS_FILTER_FIELDS
        return axios.get(url)
    },

    GET_DASHBOARD_FILTER_FIELDS : '/report/dashboard/dashboard_filter_fields',

    getDashboardFilterFields() {
        let url = this.GET_DASHBOARD_FILTER_FIELDS
        return axios.get(url)
    },

    GET_DATA_SET_FILTER_FIELDS : '/report/data_set/data_set_filter_fields',

    getDataSetFilterFields() {
        let url = this.GET_DATA_SET_FILTER_FIELDS
        return axios.get(url)
    },

    GET_DEVELOPER_FILTER_FIELDS : '/finance/developer/developer_filter_fields',

    getDeveloperFilterFields() {
        let url = this.GET_DEVELOPER_FILTER_FIELDS
        return axios.get(url)
    },

    GET_DATA_SOURCE_FILTER_FIELDS : '/report/data_source/data_source_filter_fields',

    getDataSourceFilterFields() {
        let url = this.GET_DATA_SOURCE_FILTER_FIELDS
        return axios.get(url)
    },

    GET_CHART_TYPES: "/report/report/chart_types",

    getChartTypes() {
        let url = this.GET_CHART_TYPES;
        return axios.get(url)
    }
}

export default api
