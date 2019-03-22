import axios from '../../interceptor'


const reportDashboardApi = {
    GET_DASHBOARD_FILTER_FIELDS : '/report/dashboard/dashboard_filter_fields',

    GET_DASHBOARD: '/report/dashboard',

    GET_DASHBOARD_INFO: '/report/dashboard/info',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_DASHBOARD: '/report/dashboard',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    DELETE_DASHBOARD: '/report/dashboard',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params: deleteParams})
    },

    EDIT_DASHBOARD: '/report/dashboard',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}

export default reportDashboardApi