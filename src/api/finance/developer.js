import axios from '../../interceptor'

const financeDeveloperApi = {

    LOGIN : '/finance/developer/login',
    GET_DEVELOPERS : '/finance/developer',
    CURRENT : '/finance/developer/current',
    GET_DEVELOPER_FILTER_FIELDS : '/finance/developer/developer_filter_fields',
    GET_PRIVILEGES : '/finance/developer/privileges',
    GET_ACADEMIC_DEGREES : '/finance/developer/academic_degrees',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_DEVELOPER : '/finance/developer',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    DELETE_DEVELOPER:'/finance/developer',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params : deleteParams})
    }
}


export default financeDeveloperApi