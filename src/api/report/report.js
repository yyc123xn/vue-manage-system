import axios from '../../interceptor'

const reportReportApi = {

    GET_CHART_TYPES: "/report/report/chart_types",

    getChartTypes() {
        let url = this.GET_CHART_TYPES;
        return axios.get(url)
    }
}

export default reportReportApi