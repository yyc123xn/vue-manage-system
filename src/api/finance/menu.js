import axios from '../../interceptor'

const financeMenuApi = {

    GET_MENU: '/finance/menu',

    GET_MENUS : '/finance/menu/menus',

    GET_MENU_INFO: '/finance/menu/info',

    GET_MENU_FILTER_FIELDS: "/finance/menu/menu_filter_fields",

    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    },

    ADD_MENU: '/finance/menu',

    post(urlName, postParams) {
        let url = this[urlName]
        return axios.post(url, postParams)
    },

    EDIT_MENU: '/finance/menu',

    put(urlName, putParams) {
        let url = this[urlName]
        return axios.put(url, putParams)
    },

    DELETE_MENU: '/finance/menu',

    delete(urlName, deleteParams) {
        let url = this[urlName]
        return axios.delete(url, {params: deleteParams})
    },
}


export default financeMenuApi