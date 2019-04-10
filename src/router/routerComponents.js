const Home = () => import("../components/common/Home")
const Department = () => import("../components/page/department/Department")
const Privilege = () => import("../components/page/department/Privilege")
const Dashboard = () => import("../components/page/Dashboard")
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
const ClientForm = () => import("../components/page/client/ClientForm")
const ClientTable = () => import("../components/page/client/ClientTable")
const DataSetForm = () => import("../components/page/data_set/DataSetForm")
const DataSetTable = () => import("../components/page/data_set/DataSetTable")
const DashboardForm = () => import("../components/page/dashboard/DashboardForm")
const DashboardTable = () => import("../components/page/dashboard/DashboardTable")
const DashboardInfo = () => import("../components/page/dashboard/DashboardInfo")
const DataSourceForm = () => import("../components/page/data_source/DataSourceForm")
const DataSourceTable = () => import("../components/page/data_source/DataSourceTable")
const MenuForm = () => import("../components/page/menu/MenuForm")
const MenuTable = () => import("../components/page/menu/MenuTable")
const Icon = () => import("../components/page/menu/Icon")
const FileTableForm = () => import("../components/page/file_table/FileTableForm")
const FileTableTable = () => import("../components/page/file_table/FileTableTable")

export default {
    Home: Home,
    Department: Department,
    Privilege: Privilege,
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
    ClientForm: ClientForm,
    ClientTable: ClientTable,
    DataSetForm: DataSetForm,
    DataSetTable: DataSetTable,
    DashboardForm: DashboardForm,
    DashboardTable: DashboardTable,
    DashboardInfo: DashboardInfo,
    DataSourceForm: DataSourceForm,
    DataSourceTable: DataSourceTable,
    MenuForm: MenuForm,
    MenuTable: MenuTable,
    FileTableForm: FileTableForm,
    FileTableTable: FileTableTable
};
