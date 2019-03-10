import axios from '../../interceptor'

const financeDeveloperApi = {

    GET_DEVELOPERS : '/finance/developer',

    getDevelopers(queryParams) {
        let url = this.GET_DEVELOPERS
        return axios.get(url, {params : queryParams})
    },

    CURRENT : '/finance/developer/current',

    current() {
        let url = this.CURRENT
        return axios.get(url)
    },

    LOGIN : '/finance/developer/login',

    login (username, password) {
        let url = this.LOGIN + '?username=' + username + '&password=' + password
        return axios.get(url)
    },

    GET_DEVELOPER_FILTER_FIELDS : '/finance/developer/developer_filter_fields',

    getDeveloperFilterFields() {
        let url = this.GET_DEVELOPER_FILTER_FIELDS
        return axios.get(url)
    },
}


export default financeDeveloperApi