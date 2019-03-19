import axios from '../../interceptor'

const financeVoucherApi = {

    GET_VOUCHERS: '/finance/voucher',

    GET_VOUCHER_STATUSES: '/finance/voucher/voucher_statuses',

    GET_VOUCHER_TYPES : '/finance/voucher/voucher_types',

    GET_VOUCHER_FILTER_FIELDS : '/finance/voucher/voucher_filter_fields',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_VOUCHER: '/finance/voucher',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    }
}

export default financeVoucherApi