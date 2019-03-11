import axios from '../../interceptor'

const reportDataSourceApi = {

    GET_DATA_SOURCE_FILTER_FIELDS : '/report/data_source/data_source_filter_fields',

    GET_DATA_SOURCE_TYPES : '/report/data_source/data_source_types',

    GET_DATABASES_TABLES : '/report/data_source/databases/tables',

    GET_DATA_SOURCES : '/report/data_source',

    GET_DATA_SOURCE_INFO : '/report/data_source/info',

    GET_DATABASE_TABLES : '/report/data_source/database/tables',

    async get(urlName, getParams) {
        let url = this[urlName]
        return await axios.get(url, {params : getParams})
    }

}

export default reportDataSourceApi