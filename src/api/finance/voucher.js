import axios from '../../interceptor'

const financeVoucherApi = {

    GET_VOUCHERS: '/finance/voucher',

    GET_VOUCHER_STATUSES: '/finance/voucher/voucher_statuses',

    GET_VOUCHER_TYPES : '/finance/voucher/voucher_types',

    GET_VOUCHER_FILTER_FIELDS : '/finance/voucher/voucher_filter_fields',

    GET_VOUCHER_INFO: '/finance/voucher/info',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_VOUCHER: '/finance/voucher',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    DELETE_VOUCHER: '/finance/voucher',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params : deleteParams})
    },

    EDIT_VOUCHER: '/finance/voucher',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}

export default financeVoucherApi