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

    GET_CHART_TYPES: "/report/report/chart_types",

    getChartTypes() {
        let url = this.GET_CHART_TYPES;
        return axios.get(url)
    }
}

export default api
