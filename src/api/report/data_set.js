import axios from '../../interceptor'

const reportDataSetApi = {

    GET_DATA_SET_FILTER_FIELDS : '/report/data_set/data_set_filter_fields',

    getDataSetFilterFields() {
        let url = this.GET_DATA_SET_FILTER_FIELDS
        return axios.get(url)
    },

    GET_PERIODS : '/report/data_set/periods',

    getPeriods() {
        let url = this.GET_PERIODS
        return axios.get(url)
    },

    GET_DATA_TYPES : '/report/data_set/data_types',

    getDataTypes() {
        let url = this.GET_DATA_TYPES
        return axios.get(url)
    },

    GET_FIELD_TYPES : '/report/data_set/field_types',

    getFieldTypes() {
        let url = this.GET_FIELD_TYPES
        return axios.get(url)
    },

    GET_CALCULATE_TYPES : '/report/data_set/calculate_types',

    getCalculateTypes() {
        let url = this.GET_CALCULATE_TYPES
        return axios.get(url)
    },

    DATA_SET : '/report/data_set',

    addDataSet(dataSet) {
        let url = this.DATA_SET
        return axios.post(url, dataSet)
    },

    getDataSets(queryParams) {
        let url = this.DATA_SET
        return axios.get(url, {params : queryParams})
    },

    GET_DATA_SET_INFO : "/report/data_set/info",

    getDataSetInfo(queryParams) {
        let url = this.GET_DATA_SET_INFO
        return axios.get(url, {params : queryParams})
    }
}

export default reportDataSetApi