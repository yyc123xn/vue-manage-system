import axios from '../../interceptor'

const reportDataSetApi = {

    GET_DATA_SET_FILTER_FIELDS : '/report/data_set/data_set_filter_fields',

    GET_PERIODS : '/report/data_set/periods',

    GET_DATA_TYPES : '/report/data_set/data_types',

    GET_FIELD_TYPES : '/report/data_set/field_types',

    GET_CALCULATE_TYPES : '/report/data_set/calculate_types',

    GET_DATA_SET_INFO : "/report/data_set/info",

    DATA_SET : '/report/data_set',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    }
}

export default reportDataSetApi