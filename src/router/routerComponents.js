const Home = () => import("../components/common/Home")
const Dashboard = () => import("../components/page/Dashboard")
const Icon = () => import("../components/page/Icon")
const BaseTable = () => import("../components/page/BaseTable")
const Tabs = () => import("../components/page/Tabs")
const BaseForm = () => import("../components/page/BaseForm")
const VueEditor = () => import("../components/page/VueEditor")
const Markdown = () => import("../components/page/Markdown")
const Upload = () => import("../components/page/Upload")
const BaseCharts = () => import("../components/page/BaseCharts")
const DragList = () => import("../components/page/DragList")
const DragDialog = () => import("../components/page/DragDialog")
const Permission = () => import("../components/page/Permission")

const FixedAssetsForm = () => import("../components/page/fixed_assets/FixedAssetsForm")
const FixedAssetsTable = () => import("../components/page/fixed_assets/FixedAssetsTable")
const VoucherForm = () => import("../components/page/voucher/VoucherForm")
const VoucherTable = () => import("../components/page/voucher/VoucherTable")
const DeveloperForm = () => import("../components/page/developer/DeveloperForm")
const DeveloperTable = () => import("../components/page/developer/DeveloperTable")
const ReportForm = () => import("../components/page/report/ReportForm")
const ReportTable = () => import("../components/page/report/ReportTable")
const DataSetForm = () => import("../components/page/data_set/DataSetForm")
const DataSetTable = () => import("../components/page/data_set/DataSetTable")
const DashboardForm = () => import("../components/page/dashboard/DashboardForm")
const DashboardTable = () => import("../components/page/dashboard/DashboardTable")

export default {
    Home: Home,
    Dashboard: Dashboard,
    Icon: Icon,
    BaseTable: BaseTable,
    Tabs: Tabs,
    BaseForm: BaseForm,
    VueEditor: VueEditor,
    Markdown: Markdown,
    Upload: Upload,
    BaseCharts: BaseCharts,
    DragList: DragList,
    DragDialog: DragDialog,
    Permission: Permission,

    FixedAssetsForm: FixedAssetsForm,
    FixedAssetsTable: FixedAssetsTable,
    VoucherForm: VoucherForm,
    VoucherTable: VoucherTable,
    DeveloperForm: DeveloperForm,
    DeveloperTable: DeveloperTable,
    ReportForm: ReportForm,
    ReportTable: ReportTable,
    DataSetForm: DataSetForm,
    DataSetTable: DataSetTable,
    DashboardForm: DashboardForm,
    DashboardTable: DashboardTable
};
