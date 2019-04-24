import axios from '../../interceptor'

const reportReportApi = {

    GET_CHART_TYPES: "/report/report/chart_types",

    GET_FILTER_TYPES: '/report/report/filter_types',

    GET_REPORT_DATA: '/report/report/data',

    GET_REPORT_FILTER_VALUES: '/report/report/report_filter/values',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    EXPORT_REPORT_DATA_2_FILE: '/report/report/export_data_2_file',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    }
}

export default reportReportApi