import axios from '../../interceptor'

const reportDataSourceApi = {

    GET_DATA_SOURCE_FILTER_FIELDS : '/report/data_source/data_source_filter_fields',

    getDataSourceFilterFields() {
        let url = this.GET_DATA_SOURCE_FILTER_FIELDS
        return axios.get(url)
    },

    GET_DATA_SOURCE_TYPES : '/report/data_source/data_source_types',

    getDataSourceTypes() {
        let url = this.GET_DATA_SOURCE_TYPES
        return axios.get(url)
    },

    GET_DATABASES_TABLES : '/report/data_source/databases/tables',

    getDatabasesTables() {
        let url = this.GET_DATABASES_TABLES
        return axios.get(url)
    },

}

export default reportDataSourceApi