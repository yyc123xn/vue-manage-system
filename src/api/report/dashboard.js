import axios from '../../interceptor'


const reportDashboardApi = {
    GET_DASHBOARD_FILTER_FIELDS : '/report/dashboard/dashboard_filter_fields',

    getDashboardFilterFields() {
        let url = this.GET_DASHBOARD_FILTER_FIELDS
        return axios.get(url)
    },
}

export default reportDashboardApi