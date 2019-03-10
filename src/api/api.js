import axios from '../interceptor'
import financeDeveloperApi from './finance/developer'
import financeFixedAssetsApi from './finance/fixed_assets'
import financeVoucherApi from './finance/voucher'
import financeWagesApi from './finance/wages'
import reportDataSetApi from './report/data_set'
import reportDashboardApi from './report/dashboard'
import reportDataSourceApi from './report/data_source'
import reportReportApi from './report/report'

const api = {

    GET_MENU : '/finance/common/menu',

    getMenu () {
        let url = this.GET_MENU
        return axios.get(url)
    },

    FINANCE_DEVELOPER_API : financeDeveloperApi,

    FINANCE_VOUCHER_API : financeVoucherApi,

    FINANCE_FIXED_ASSETS_API : financeFixedAssetsApi,

    FINANCE_WAGES_API : financeWagesApi,

    REPORT_DATA_SET_API : reportDataSetApi,

    REPORT_DATA_SOURCE_API : reportDataSourceApi,

    REPORT_REPORT_API : reportReportApi,

    REPORT_DASHBOARD_API : reportDashboardApi
}

export default api
