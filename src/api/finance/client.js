import axios from '../../interceptor'

const financeClientApi = {

    GET_CLIENTS : '/finance/client',
    GET_CLIENT_FILTER_FIELDS : '/finance/client/client_filter_fields',
    GET_CLIENT_INFO: '/finance/client/info',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_CLIENT : '/finance/client',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    DELETE_CLIENT:'/finance/client',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params : deleteParams})
    },

    EDIT_CLIENT: '/finance/client',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}


export default financeClientApi