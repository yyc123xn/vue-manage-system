import axios from '../../interceptor'

const financeCommonApi = {

    GET_MENUS : '/finance/common/menu',


    get(urlName, getParams) {
        let url = this[urlName]
        return axios.get(url, {params : getParams})
    }
}


export default financeCommonApi