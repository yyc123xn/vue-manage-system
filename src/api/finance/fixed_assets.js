import axios from '../../interceptor'

const financeFixedAssetsApi = {

    GET_FIXED_ASSETS_FILTER_FIELDS : '/finance/fixed_assets/fixed_assets_filter_fields',

    GET_FIXED_ASSETS: '/finance/fixed_assets',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_FIXED_ASSETS: '/finance/fixed_assets',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    DELETE_FIXED_ASSETS: '/finance/fixed_assets',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params: deleteParams})
    }
}

export default financeFixedAssetsApi