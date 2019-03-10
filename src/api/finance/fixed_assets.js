import axios from '../../interceptor'

const financeFixedAssetsApi = {
    GET_FIXED_ASSETS_FILTER_FIELDS : '/finance/fixed_assets/fixed_assets_filter_fields',

    getFixedAssetsFilterFields() {
        let url = this.GET_FIXED_ASSETS_FILTER_FIELDS
        return axios.get(url)
    }
}

export default financeFixedAssetsApi