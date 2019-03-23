import axios from '../interceptor'
import financeCommonApi from './finance/common'
import financeDeveloperApi from './finance/developer'
import financeFixedAssetsApi from './finance/fixed_assets'
import financeVoucherApi from './finance/voucher'
import financeWagesApi from './finance/wages'
import financeClientApi from './finance/client'
import reportDataSetApi from './report/data_set'
import reportDashboardApi from './report/dashboard'
import reportDataSourceApi from './report/data_source'
import reportReportApi from './report/report'

const api = {

    FINANCE_COMMON_API: financeCommonApi,

    FINANCE_DEVELOPER_API : financeDeveloperApi,

    FINANCE_VOUCHER_API : financeVoucherApi,

    FINANCE_FIXED_ASSETS_API : financeFixedAssetsApi,

    FINANCE_WAGES_API : financeWagesApi,

    FINANCE_CLIENT_API: financeClientApi,

    REPORT_DATA_SET_API : reportDataSetApi,

    REPORT_DATA_SOURCE_API : reportDataSourceApi,

    REPORT_REPORT_API : reportReportApi,

    REPORT_DASHBOARD_API : reportDashboardApi
}

export default api
