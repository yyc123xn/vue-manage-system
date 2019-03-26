import axios from '../../interceptor'

const financeClientApi = {

    GET_DEPARTMENTS : '/finance/department',

    GET_DEPARTMENT_INFO: '/finance/department/info',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_DEPARTMENT : '/finance/department',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    DELETE_DEPARTMENT:'/finance/department',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params : deleteParams})
    },

    EDIT_DEPARTMENT: '/finance/department',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}


export default financeClientApi