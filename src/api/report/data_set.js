import axios from '../../interceptor'

const reportDataSetApi = {

    GET_DATA_SET_FILTER_FIELDS : '/report/data_set/data_set_filter_fields',

    GET_PERIODS : '/report/data_set/periods',

    GET_DATA_TYPES : '/report/data_set/data_types',

    GET_FIELD_TYPES : '/report/data_set/field_types',

    GET_CALCULATE_TYPES : '/report/data_set/calculate_types',

    GET_DATA_SET_INFO : '/report/data_set/info',

    GET_DATA_SET: '/report/data_set',

    GET_DATA_SET_METRICS : '/report/data_set/metrics',

    GET_DATA_SET_DIMENSIONS: '/report/data_set/dimensions',

    GET_DATA_SETS_FIELDS: '/report/data_set/data_sets_fields',

    BACKFILL: '/report/data_set/backfill',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params: getParams})
    },

    ADD_DATA_SET : '/report/data_set',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    DELETE_DATA_SET: '/report/data_set',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params: deleteParams})
    },

    EDIT_DATA_SET: '/report/data_set',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}

export default reportDataSetApi