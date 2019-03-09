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

    GET_DATA_SOURCE_TYPES : '/report/data_source/data_source_types',

    getDataSourceTypes() {
        let url = this.GET_DATA_SOURCE_TYPES
        return axios.get(url)
    },

    GET_DATABASES_TABLES : '/report/data_source/databases/tables',

    getDatabasesTables() {
        let url = this.GET_DATABASES_TABLES
        return axios.get(url)
    },

    GET_PERIODS : '/report/data_set/periods',

    getPeriods() {
        let url = this.GET_PERIODS
        return axios.get(url)
    },

    GET_DATA_TYPES : '/report/data_set/data_types',

    getDataTypes() {
        let url = this.GET_DATA_TYPES
        return axios.get(url)
    },

    GET_FIELD_TYPES : '/report/data_set/field_types',

    getFieldTypes() {
        let url = this.GET_FIELD_TYPES
        return axios.get(url)
    },

    GET_CALCULATE_TYPES : '/report/data_set/calculate_types',

    getCalculateTypes() {
        let url = this.GET_CALCULATE_TYPES
        return axios.get(url)
    },

    ADD_DATA_SET : '/report/data_set',

    addDataSet(dataSet) {
        let url = this.ADD_DATA_SET
        return axios.post(url, dataSet)
    },

    GET_CHART_TYPES: "/report/report/chart_types",

    getChartTypes() {
        let url = this.GET_CHART_TYPES;
        return axios.get(url)
    }
}

export default api
