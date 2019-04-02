import axios from '../../interceptor'

const reportReportFilterApi = {

    GET_REPORT_REPORT_FILTER_VALUES: '/report/report_filter/values',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    }
}

export default reportReportFilterApi