import axios from '../../interceptor'

const financeMenuApi = {

    GET_MENUS : '/finance/menu/menus',

    GET_MENU_FILTER_FIELDS: "/finance/menu/menu_filter_fields",

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    }
}


export default financeMenuApi