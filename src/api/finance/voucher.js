import axios from '../../interceptor'

const financeVoucherApi = {
    GET_VOUCHER_TYPES : '/finance/voucher/voucher_type',

    GET_VOUCHER_FILTER_FIELDS : '/finance/voucher/voucher_filter_fields',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    }
}

export default financeVoucherApi