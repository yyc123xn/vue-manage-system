import axios from '../../interceptor'

const reportDataSourceApi = {

    GET_DATA_SOURCE_FILTER_FIELDS : '/report/data_source/data_source_filter_fields',

    GET_DATA_SOURCE_TYPES : '/report/data_source/data_source_types',

    GET_DATABASES_TABLES : '/report/data_source/databases/tables',

    GET_DATA_SOURCES : '/report/data_source',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    }

}

export default reportDataSourceApi