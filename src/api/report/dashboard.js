import axios from '../../interceptor'


const reportDashboardApi = {
    GET_DASHBOARD_FILTER_FIELDS : '/report/dashboard/dashboard_filter_fields',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_DASHBOARD: '/report/dashboard',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    }
}

export default reportDashboardApi