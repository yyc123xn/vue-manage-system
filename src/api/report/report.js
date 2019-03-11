import axios from '../../interceptor'

const reportReportApi = {

    GET_CHART_TYPES: "/report/report/chart_types",

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    }
}

export default reportReportApi