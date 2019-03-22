import axios from '../../interceptor'

const reportDataSourceApi = {

    GET_DATA_SOURCE_FILTER_FIELDS : '/report/data_source/data_source_filter_fields',

    GET_DATA_SOURCE_TYPES : '/report/data_source/data_source_types',

    GET_DATABASES_TABLES : '/report/data_source/databases/tables',

    GET_DATA_SOURCES : '/report/data_source',

    GET_DATA_SOURCE_INFO : '/report/data_source/info',

    GET_DATABASE_TABLES : '/report/data_source/database/tables',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_DATA_SOURCE: '/report/data_source',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    DELETE_DATA_SOURCE: '/report/data_source',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params: deleteParams})
    },

    EDIT_DATA_SOURCE: '/report/data_source',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}

export default reportDataSourceApi