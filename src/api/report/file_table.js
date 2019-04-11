import axios from '../../interceptor'

const reportFileTableApi = {

    GET_FILE_TABLE_FILTER_FIELDS : '/report/file_table/file_table_filter_fields',

    GET_FILE_TABLE: '/report/file_table',

    GET_FILE_TABLE_INFO: '/report/file_table/info',

    FILE_2_TABLE: '/report/file_table/file_2_table',

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_FILE_TABLE: '/report/file_table',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    EDIT_FILE_TABLE: '/report/file_table',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}

export default reportFileTableApi