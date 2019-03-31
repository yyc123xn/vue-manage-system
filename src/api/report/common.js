import axios from '../../interceptor'

const reportCommonApi = {

    GET_CHART_TYPE_TOOL_TIPS : '/report/common/chart_type_tool_tips',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    }
}

export default reportCommonApi