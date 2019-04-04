import axios from '../../interceptor'

const echartsCommon = {

    GET_ECHARTS_CHINA_JSON : '/echarts@3.6.2/map/json/china.json',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    }
}

export default echartsCommon