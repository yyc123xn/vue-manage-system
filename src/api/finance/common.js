import axios from '../../interceptor'

const financeCommonApi = {

    GET_BUSINESSES: '/finance/common/businesses',

    GET_TABLE_HEADER: '/finance/common/table_header',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_BUSINESS: '/finance/common/business',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    EDIT_BUSINESS: '/finance/common/business',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}


export default financeCommonApi