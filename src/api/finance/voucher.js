import axios from '../../interceptor'

const financeVoucherApi = {
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
}

export default financeVoucherApi